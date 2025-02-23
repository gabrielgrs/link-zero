'use server'

import { db } from '@/libs/mongoose'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import {
  createCheckoutSession,
  createPrice,
  createProduct,
  decodeOAuthToken,
  getOAuthLink,
  updatePrice,
  updateProduct,
} from '@/libs/stripe/utils'
import { parseData } from '@/utils/action'
import { getDomain } from '@/utils/action/server'
import { currencies } from '@/utils/constants/currencies'
import { PLATFORM_FEE } from '@/utils/constants/pricing'
import { z } from 'zod'
import { createOrFindUser } from './auth'
import { authProcedure } from './procedures'

export const createProductAndPrice = authProcedure
  .input(
    z.object({
      currency: z.enum(currencies),
      name: z.string(),
      description: z.string().optional(),
      cover: z.string().optional(),
      price: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const createdProduct = await createProduct({
      name: input.name,
      description: input.description,
      images: input.cover,
    })

    const createdPrice = await createPrice(createdProduct.id, {
      currency: input.currency,
      nickname: input.name,
      unitAmount: input.price,
    })

    return {
      productId: createdProduct.id,
      priceId: createdPrice.id,
    }
  })

export const updateProductAndPrice = authProcedure
  .input(
    z.object({
      name: z.string().nonempty(),
      description: z.string().optional(),
      cover: z.string().optional(),
      stripeProductId: z.string().nonempty(),
      stripePriceId: z.string().nonempty(),
    }),
  )
  .handler(async ({ input }) => {
    await updateProduct(input.stripeProductId, {
      name: input.name,
      description: input.description,
      image: input.cover,
    })

    await updatePrice(input.stripePriceId, {
      nickname: input.name,
    })
  })

export const activeOrInactiveProductAndPrice = authProcedure
  .input(
    z.object({
      stripeProductId: z.string().nonempty(),
      stripePriceId: z.string().nonempty(),
      active: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      await updateProduct(input.stripeProductId, {
        active: input.active,
      })

      await updatePrice(input.stripePriceId, {
        active: input.active,
      })

      return true
    } catch {
      return false
    }
  })

export const linkAccount = authProcedure.handler(async () => {
  const domain = await getDomain()
  const url = await getOAuthLink(`${domain}/api/stripe/oauth/callback`)

  return parseData({ url })
})

export const linkStripeAccountByCode = authProcedure
  .input(z.object({ code: z.string().nonempty() }))
  .handler(async ({ input, ctx }) => {
    const response = await decodeOAuthToken(input.code)

    await db.user.findOneAndUpdate(
      { _id: ctx.user._id, stripeAccountId: null },
      { stripeAccountId: response.stripe_user_id },
    )

    return true
  })

export const createCheckout = authProcedure
  .input(z.object({ productId: z.string(), email: z.string().nonempty() }))
  .handler(async ({ input }) => {
    const domain = await getDomain()

    const user = await createOrFindUser(input.email, { username: input.email.split('@')[0] })
    if (!user) throw new Error('User is required')

    const product = await db.product.findOne({ _id: input.productId }).populate<{ user: UserSchema }>('user').lean()
    if (!product) throw new Error('Not found')
    await db.product.updateOne({ _id: product._id }, { $push: { sales: { user: user._id, price: product.price } } })

    if (!product.user.stripeAccountId) throw new Error('User is not connected to stripe')

    const applicationFeeAmount = (PLATFORM_FEE * product.price) / 100

    if (!product.stripePriceId || !product.stripeProductId) throw new Error('Failed to process your request')

    const { url } = await createCheckoutSession({
      userId: user._id.toString(),
      customerId: user.stripeCustomerId,
      applicationFeeAmount,
      currency: product.currency,
      destinationAccountId: product.user.stripeAccountId,
      productId: product._id.toString(),
      priceId: product.stripePriceId,
      successUrl: `${domain}/subscription?type=success`,
      cancelUrl: `${domain}/subscription?type=failure`,
    })

    if (!url) throw new Error('Failed to process your request')
    return { url }
  })
