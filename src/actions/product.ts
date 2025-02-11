'use server'

import { db } from '@/libs/mongoose'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { parseData } from '@/utils/action'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'

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

export const createProduct = authProcedure
  .input(
    z.object({
      slug: z.string().nonempty(),
      category: z.string().nonempty(),
      characteristics: z.array(z.object({ label: z.string(), value: z.string() })),
      content: z.string().nonempty(),
      name: z.string().nonempty(),
      price: z.string().nonempty(),
      cover: z.string().nullable(),
    } as Record<keyof ProductSchema, any>),
  )
  .handler(async ({ ctx, input }) => {
    const product = await db.product.create({ ...input, price: Number(input.price), user: ctx.user._id })

    return parseData(product)
  })

export const getRandomProducts = createServerAction().handler(async () => {
  const products = await db.product.find().populate<{ user: UserSchema }>('user').limit(9).lean()

  return parseData(products)
})
