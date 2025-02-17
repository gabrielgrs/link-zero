'use server'

import { db } from '@/libs/mongoose'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { uploadFile } from '@/libs/vercel/blob'
import { parseData } from '@/utils/action'
import { getDomain } from '@/utils/action/server'
import { currencies } from '@/utils/constants/currencies'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'
import { activeOrInactiveProductAndPrice, createProductAndPrice, updateProductAndPrice } from './stripe'

export const getProductBySlug = createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input }) => {
    const product = await db.product.findOne({ slug: input.slug }).populate<{ user: UserSchema }>('user').lean()

    if (!product) throw new Error('Not found')

    return parseData(product)
  })

export const getProductBySlugWithContent = createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input }) => {
    const product = await db.product
      .findOne({ slug: input.slug })
      .select('+content')
      .populate<{ user: UserSchema }>('user')
      .lean()

    if (!product) throw new Error('Not found')

    return parseData(product)
  })

export const getUserProducts = authProcedure.handler(async ({ ctx }) => {
  const products = await db.product.find({ user: ctx.user._id }).populate<{ user: UserSchema }>('user').lean()

  return parseData(products)
})

export const getUserLibraryProducts = authProcedure.handler(async ({ ctx }) => {
  const products = await db.product.find({ sales: { $in: [{ user: ctx.user._id }] } }).lean()

  return parseData(products)
})

async function getContent(file: File | string) {
  if (file instanceof File) {
    const uploadedFile = await uploadFile(file)
    return {
      url: uploadedFile.url,
      format: file.type.split('/')[1],
    }
  }

  return {
    url: file,
    format: 'custom',
  }
}

export const createProduct = authProcedure
  .input(
    z.object({
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      details: z.array(z.object({ label: z.string(), value: z.string() })),
      description: z.string().nonempty(),
      file: z.union([z.array(z.instanceof(File)), z.string()]),
      name: z.string().nonempty(),
      currency: z.enum(currencies),
      price: z.string().nonempty(),
      cover: z.string().nullable(),
    } as Record<keyof ProductSchema | 'file', any>),
  )
  .handler(async ({ ctx, input }) => {
    const content = await getContent(input.file[0] instanceof File ? input.file[0] : String(input))

    const product = await db.product.create({
      ...input,
      content,
      price: Number(input.price),
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
      cover: z.string().nullable(),
    } as Record<keyof ProductSchema | 'file', any>),
  )
  .handler(async ({ ctx, input }) => {
    const { _id, ...rest } = input

    const product = await db.product.findOneAndUpdate({ _id, user: ctx.user._id }, { ...rest }).lean()
    if (!product) throw new Error('Not found')

    const [, err] = await updateProductAndPrice({
      stripeProductId: product.stripeProductId!,
      stripePriceId: product.stripePriceId!,
      cover: input.cover,
      name: input.name,
      description: input.description,
    })
    if (err) throw err

    return parseData(input)
  })

export const getRandomProducts = createServerAction().handler(async () => {
  const products = await db.product
    .find({ url: { $ne: null }, active: true })
    .populate<{ user: UserSchema }>('user')
    .limit(9)
    .lean()

  return parseData(products)
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
