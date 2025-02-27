'use server'

import { db } from '@/libs/mongoose'
import { productStatus } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { removeFile, uploadFile } from '@/libs/vercel/blob'
import { parseData } from '@/utils/action'
import { getDomain, redirectToNotFound } from '@/utils/action/server'
import { currencies } from '@/utils/constants/currencies'

import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'
import { activeOrInactiveProductAndPrice, createProductAndPrice, updateProductAndPrice } from './stripe'

export const getProductBySlug = createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input }) => {
    const product = await db.product.findOne({ slug: input.slug }).populate<{ user: UserSchema }>('user').lean()

    if (!product) return redirectToNotFound()
    return parseData(product)
  })

export const getAuthUserProducts = authProcedure.handler(async ({ ctx }) => {
  const products = await db.product.find({ user: ctx.user._id }).populate<{ user: UserSchema }>('user').lean()

  const productsWithSuccessfulSales = products.map((item) => ({
    ...item,
    sales: item.sales.filter((sale) => sale.status === 'SUCCESS'),
  }))
  return parseData(productsWithSuccessfulSales)
})

export const getUserLibraryProducts = authProcedure.handler(async ({ ctx }) => {
  const productsBouthByUser = await db.product
    .find({ sales: { $elemMatch: { user: ctx.user._id, status: 'SUCCESS' } } })
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

export const createProduct = authProcedure
  .input(
    z.object({
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      description: z.string().nonempty(),
      file: z.instanceof(File),
      name: z.string().nonempty(),
      currency: z.enum(currencies),
      price: z.number().min(3).nonnegative(),
      cover: z.instanceof(File).optional(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    if (!ctx.user.stripeAccountId) throw new Error('User is not connected to stripe')

    const content = await getContent(input.file)
    const cover = input.cover ? await uploadFile(input.cover).then((res) => res.url) : null

    const product = await db.product.create({
      ...input,
      cover,
      content,
      user: ctx.user._id,
    })

    return parseData(product)
  })

export const updateProduct = authProcedure
  .input(
    z.object({
      _id: z.string().nonempty(),
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      description: z.string().nonempty(),
      name: z.string().nonempty(),
      cover: z.union([z.instanceof(File), z.string()]).optional(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    if (!ctx.user.stripeAccountId) throw new Error('User is not connected to stripe')

    const { _id, ...rest } = input

    if (input.cover instanceof File) {
      const product = await db.product.findOne({ _id, user: ctx.user._id }).lean()
      if (product?.cover) await removeFile(product.cover)
    }

    const newCover = input.cover instanceof File ? await uploadFile(input.cover).then((res) => res.url) : input.cover

    const product = await db.product.findOneAndUpdate(
      { _id, user: ctx.user._id },
      newCover ? { ...rest, cover: newCover } : rest,
    )
    if (!product) throw new Error('Not found')

    if (product.stripePriceId && product.stripeProductId) {
      const [, err] = await updateProductAndPrice({
        stripeProductId: product.stripeProductId,
        stripePriceId: product.stripePriceId,
        name: input.name,
        description: input.description,
        cover: newCover,
      })
      if (err) throw err
    }

    return parseData(input)
  })

export const getProductsByQuery = createServerAction()
  .input(z.object({ searchText: z.string().optional(), category: z.string().optional() }))
  .handler(async ({ input }) => {
    const query: Record<string, unknown> = {
      status: 'PUBLISHED',
    }

    if (input.searchText) {
      query.name = { $regex: input.searchText, $options: 'i' }
    }

    if (input.category) {
      query.category = input.category
    }

    const products = await db.product
      .find(query)
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

export const updateProductStatus = authProcedure
  .input(z.object({ productId: z.string(), status: z.enum(productStatus) }))
  .handler(async ({ input, ctx }) => {
    if (input.status === 'PUBLISHED') {
      const product = await db.product.findOne({ _id: input.productId, user: ctx.user._id }).lean()
      if (!product) throw new Error('Not found')

      if (!product.stripePriceId && !product.stripeProductId) {
        const [res, err] = await createProductAndPrice({
          cover: product.cover,
          currency: product.currency,
          name: product.name,
          description: product.description,
          price: product.price,
        })
        if (err) throw err

        await db.product.findOneAndUpdate(
          { _id: input.productId },
          { stripeProductId: res.productId, stripePriceId: res.priceId, status: 'PUBLISHED' },
        )

        return parseData(input)
      }
    } else {
      const success = await activeOrInactiveProductAndPrice({
        stripeProductId: input.productId,
        stripePriceId: input.productId,
        active: true,
      })
      if (!success) throw new Error('Failed to process your request')
    }

    const product = await db.product.findOneAndUpdate(
      { _id: input.productId, user: ctx.user._id },
      { status: input.status },
    )
    if (!product) throw new Error('Not found')

    return parseData(input)
  })

export const getProductsByUser = createServerAction()
  .input(z.object({ userId: z.string() }))
  .handler(async ({ input }) => {
    const products = await db.product.find({ user: input.userId, status: 'PUBLISHED' }).lean()

    return parseData(products)
  })
