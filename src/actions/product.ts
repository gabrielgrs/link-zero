'use server'

import { db } from '@/libs/mongoose'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { removeFile, uploadFile } from '@/libs/vercel/blob'
import { parseData } from '@/utils/action'
import { getDomain } from '@/utils/action/server'
import { Currency, currencies } from '@/utils/constants/currencies'
import { MIN_PRODUCT_PRICE } from '@/utils/constants/pricing'
import { formatCurrency } from '@/utils/currency'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'
import {
  activeOrInactiveProductAndPrice,
  createProductAndPrice,
  getCurrencyPriceInCents,
  updateProductAndPrice,
} from './stripe'

export const getProductBySlug = createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input }) => {
    const product = await db.product
      .findOne({ slug: input.slug, active: true })
      .populate<{ user: UserSchema }>('user')
      .lean()

    if (!product) throw new Error('Not found')

    return parseData(product)
  })

export const getAuthUserProducts = authProcedure.handler(async ({ ctx }) => {
  const products = await db.product.find({ user: ctx.user._id }).populate<{ user: UserSchema }>('user').lean()

  const productsWithSuccessfulSales = products.map((item) => ({
    ...item,
    sales: item.sales.filter((sale) => sale.status === 'success'),
  }))
  return parseData(productsWithSuccessfulSales)
})

export const getUserLibraryProducts = authProcedure.handler(async ({ ctx }) => {
  const productsBouthByUser = await db.product
    .find({ sales: { $elemMatch: { user: ctx.user._id } } })
    .populate<{ user: UserSchema }>('user')
    .lean()
  return parseData(productsBouthByUser)
})

async function getContent(file: File) {
  const uploadedFile = await uploadFile(file)
  return {
    url: uploadedFile.url,
    format: file.type.split('/')[1],
  }
}

async function isValidMinValue(value: number, currency: Currency) {
  if (currency === 'USD')
    return {
      isValid: value >= MIN_PRODUCT_PRICE,
      minPrice: formatCurrency(MIN_PRODUCT_PRICE, 'USD'),
    }

  const currencyQuotation = await getCurrencyPriceInCents('USD', currency)
  const convertedMinValue = MIN_PRODUCT_PRICE * currencyQuotation

  return {
    isValid: value >= convertedMinValue,
    minPrice: formatCurrency(convertedMinValue / 100, currency.toUpperCase() as Uppercase<Currency>),
  }
}

export const createProduct = authProcedure
  .input(
    z.object({
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      details: z.array(z.object({ label: z.string(), value: z.string() })),
      description: z.string().nonempty(),
      file: z.instanceof(File),
      name: z.string().nonempty(),
      currency: z.enum(currencies),
      price: z.number(),
      // cover: z.instanceof(File).optional(),
    } as Record<keyof ProductSchema | 'file', any>),
  )
  .handler(async ({ ctx, input }) => {
    if (!ctx.user.stripeAccountId) throw new Error('User is not connected to stripe')

    const content = await getContent(input.file[0])
    const cover = input.cover ? await uploadFile(input.cover[0]).then((res) => res.url) : null

    const { isValid, minPrice } = await isValidMinValue(input.price, input.currency)
    if (!isValid) throw new Error(`Price must be at least ${minPrice} (${formatCurrency(MIN_PRODUCT_PRICE, 'USD')})`)

    const product = await db.product.create({
      ...input,
      cover,
      content,
      user: ctx.user._id,
    })

    const [res, err] = await createProductAndPrice({
      cover: product.cover,
      currency: product.currency,
      name: product.name,
      description: product.description,
      price: product.price,
    })
    if (err) {
      await db.product.deleteOne({ _id: product._id })
      throw err
    }

    await db.product.updateOne({ _id: product._id }, { stripeProductId: res.productId, stripePriceId: res.priceId })

    return parseData(product)
  })

export const updateProduct = authProcedure
  .input(
    z.object({
      _id: z.string().nonempty(),
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      details: z.array(z.object({ label: z.string(), value: z.string() })),
      description: z.string().nonempty(),
      name: z.string().nonempty(),
      cover: z.union([z.string(), z.instanceof(File)]).optional(),
      coverToRemove: z.string().optional(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    if (!ctx.user.stripeAccountId) throw new Error('User is not connected to stripe')

    const { _id, ...rest } = input

    const newCover = input.cover instanceof File ? await uploadFile(input.cover).then((res) => res.url) : input.cover

    const product = await db.product.findOneAndUpdate({ _id, user: ctx.user._id, cover: newCover }, { ...rest })
    if (!product) throw new Error('Not found')

    const [, err] = await updateProductAndPrice({
      stripeProductId: product.stripeProductId!,
      stripePriceId: product.stripePriceId!,
      name: input.name,
      description: input.description,
      cover: newCover,
    })
    if (err) throw err

    if (input.coverToRemove) await removeFile(input.coverToRemove)

    return parseData(input)
  })

export const getProductsByCategory = createServerAction()
  .input(z.object({ category: z.string().nonempty() }))
  .handler(async ({ input }) => {
    const products = await db.product
      .find({ category: input.category, active: true })
      // .find()
      .populate<{ user: UserSchema }>('user')
      .select('+content')
      .limit(20)
      .lean()

    return parseData(products.map((item) => ({ ...item, content: { url: '', format: item.content.format } })))
  })

export const generateDownloadUrl = createServerAction()
  .input(z.object({ productId: z.string() }))
  .onError(console.error)
  .handler(async ({ input }) => {
    const product = await db.product.findOne({ _id: input.productId }).select('+content').lean()
    if (!product?.content) throw new Error('Product not found')

    const link = await db.link.create({ product: product._id })
    if (!link) throw new Error('Failed to create link')

    const domain = await getDomain()

    return { url: `${domain}/proxy-link?identifier=${link._id}` }
  })

export const activeOrInactiveProduct = authProcedure
  .input(z.object({ productId: z.string(), active: z.boolean() }))
  .handler(async ({ input, ctx }) => {
    const success = await activeOrInactiveProductAndPrice({
      stripeProductId: input.productId,
      stripePriceId: input.productId,
      active: input.active,
    })
    if (!success) throw new Error('Failed to process your request')

    const product = await db.product.findOneAndUpdate(
      { _id: input.productId, user: ctx.user._id },
      { active: input.active },
    )
    if (!product) throw new Error('Not found')

    return parseData(input)
  })

export const getProductsByUser = createServerAction()
  .input(z.object({ userId: z.string() }))
  .handler(async ({ input }) => {
    const products = await db.product.find({ user: input.userId, active: true }).lean()

    return parseData(products)
  })
