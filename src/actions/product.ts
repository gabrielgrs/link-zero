'use server'

import { db } from '@/libs/mongoose'
import { productStatus } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { removeFile, uploadFile } from '@/libs/vercel/blob'
import { parseData } from '@/utils/action'
import { getDomain, redirectToNotFound } from '@/utils/action/server'
import { currencies } from '@/utils/constants/currencies'

import { MAX_PRODUCT_PRICE, MIN_PRODUCT_PRICE } from '@/utils/constants/pricing'
import slugify from 'slugify'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'
import { activeOrInactiveProductAndPrice, createProductAndPrice, updateProductAndPrice } from './stripe'

export const getRandomProducts = createServerAction()
  .input(z.object({ limit: z.number() }))
  .handler(async ({ input }) => {
    const products = await db.product
      .find()
      .limit(input.limit || 10)
      .populate<{ user: UserSchema }>('user')
      .lean()

    // TODO: remove filter
    return parseData(products.filter((x) => Boolean(x.user)))
  })

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
  const formatFromName = file.name.split('.').pop()
  return {
    url: uploadedFile.url,
    format: formatFromName || file.type.split('/')[1],
  }
}

export const createProduct = authProcedure
  .input(
    z.object({
      description: z.string().nonempty(),
      file: z.instanceof(File),
      name: z.string().nonempty(),
      currency: z.enum(currencies),
      price: z
        .number()
        .min(MIN_PRODUCT_PRICE / 100)
        .max(MAX_PRODUCT_PRICE / 100)
        .nonnegative(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    let contentUrl = ''

    try {
      if (!ctx.user.stripeAccountId) throw new Error('User is not connected to stripe')

      const content = await getContent(input.file)

      const product = await db.product.create({
        ...input,
        slug: slugify(input.name, { lower: true }),
        content,
        user: ctx.user._id,
      })

      return parseData(product)
    } catch (error) {
      if (contentUrl) await removeFile(contentUrl)

      throw error
    }
  })

export const updateProduct = authProcedure
  .input(
    z.object({
      _id: z.string().nonempty(),
      description: z.string().nonempty(),
      name: z.string().nonempty(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    if (!ctx.user.stripeAccountId) throw new Error('User is not connected to stripe')

    const product = await db.product.findOneAndUpdate({ _id: input._id, user: ctx.user._id })
    if (!product) throw new Error('Not found')

    if (product.stripePriceId && product.stripeProductId) {
      const [, err] = await updateProductAndPrice({
        stripeProductId: product.stripeProductId,
        stripePriceId: product.stripePriceId,
        name: input.name,
        description: input.description,
      })
      if (err) throw err
    }

    return parseData(input)
  })

export const getProductsByQuery = createServerAction()
  .input(z.object({ searchText: z.string().optional() }))
  .handler(async ({ input }) => {
    const query: Record<string, unknown> = {
      status: 'PUBLISHED',
    }

    if (input.searchText) {
      query.name = { $regex: input.searchText, $options: 'i' }
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
    const products = await db.product
      .find({ user: input.userId, status: 'PUBLISHED' })
      .populate<{ user: UserSchema }>('user')
      .lean()

    return parseData(products)
  })
