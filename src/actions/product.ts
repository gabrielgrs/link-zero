'use server'

import { db } from '@/libs/mongoose'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { duplicateFile, removeFile, uploadFile } from '@/libs/vercel/blob'
import { parseData } from '@/utils/action'
import { currencies } from '@/utils/constants/currencies'
import { waitUntil } from '@vercel/functions'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'
import { createProductAndPrice } from './stripe'

export const getProductBySlug = createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input }) => {
    const product = await db.product.findOne({ slug: input.slug }).populate<{ user: UserSchema }>('user').lean()

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

export const createProduct = authProcedure
  .input(
    z.object({
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      characteristics: z.array(z.object({ label: z.string(), value: z.string() })),
      description: z.string().nonempty(),
      file: z.array(z.instanceof(File)),
      name: z.string().nonempty(),
      currency: z.enum(currencies),
      price: z.string().nonempty(),
      cover: z.string().nullable(),
    } as Record<keyof ProductSchema | 'file', any>),
  )
  .handler(async ({ ctx, input }) => {
    const cover = input.cover || ''

    const file = await uploadFile(input.file[0])

    const product = await db.product.create({
      ...input,
      url: file.url,
      cover,
      price: Number(input.price),
      user: ctx.user._id,
    })

    const [res, err] = await createProductAndPrice({
      cover,
      currency: product.currency,
      name: product.slug,
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

export const getRandomProducts = createServerAction().handler(async () => {
  const products = await db.product.find().populate<{ user: UserSchema }>('user').limit(9).lean()

  return parseData(products)
})

async function deleteAfterSomeTime(callback: () => void, durationInMs: number) {
  await new Promise((resolve) => setTimeout(resolve, durationInMs))
  return callback()
}

export const generateDownloadUrl = createServerAction()
  .input(z.object({ productId: z.string() }))
  .handler(async ({ input }) => {
    const product = await db.product.findOne({ _id: input.productId }).select('+url').lean()
    if (!product?.url) throw new Error('Product not found')

    const randomHash = Math.random().toString(36).substring(2)

    const duplicated = await duplicateFile(product.url, `temp/${product.name}-${randomHash}`)
    waitUntil(deleteAfterSomeTime(() => removeFile(duplicated.url), 5000))
    return { url: duplicated.url }
  })
