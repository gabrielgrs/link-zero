'use server'

import { db } from '@/libs/mongoose'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import stripeClient from '@/libs/stripe'
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
    const createdProduct = await stripeClient.products.create({
      name: input.name,
      description: input.description,
      images: input.cover ? [input.cover] : [],
    })

    const createdPrice = await stripeClient.prices.create({
      currency: input.currency,
      nickname: input.name,
      unit_amount: input.price,
      product: createdProduct.id,
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
    await stripeClient.products.update(input.stripeProductId, {
      name: input.name,
      description: input.description,
      images: input.cover ? [input.cover] : [],
    })

    await stripeClient.prices.update(input.stripePriceId, {
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
      await stripeClient.products.update(input.stripeProductId, {
        active: input.active,
      })

      await stripeClient.prices.update(input.stripePriceId, {
        active: input.active,
      })

      return true
    } catch {
      return false
    }
  })

export const linkAccount = authProcedure.onError(console.error).handler(async ({ ctx }) => {
  const account = await stripeClient.accounts.create({
    type: 'express',
    email: ctx.user.email,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: {
      userId: ctx.user._id.toString(),
    },
  })

  const domain = await getDomain()

  const accountLink = await stripeClient.accountLinks.create({
    account: account.id,
    refresh_url: `${domain}/dashboard`,
    return_url: `${domain}/dashboard`,
    type: 'account_onboarding',
  })

  return parseData({
    url: accountLink.url,
  })
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

    const { url } = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: user._id.toString(),
      success_url: `${domain}/subscription?type=success`,
      cancel_url: `${domain}/subscription?type=failure`,
      mode: 'payment',
      currency: product.currency,
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      customer: user.stripeCustomerId,
      metadata: {
        productId: product._id.toString(),
      },
      payment_intent_data: {
        application_fee_amount: PLATFORM_FEE,
        transfer_data: {
          destination: product.user.stripeAccountId,
        },
      },
    })

    if (!url) throw new Error('Failed to process your request')
    return { url }
  })
