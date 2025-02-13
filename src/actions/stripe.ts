'use server'

import { db } from '@/libs/mongoose'
import stripeClient from '@/libs/stripe'
import { getDomain } from '@/utils/action/server'
import { currencies } from '@/utils/constants/currencies'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { createOrFindUser } from './auth'
import { authProcedure } from './procedures'

export const createProductAndPrice = authProcedure
  .input(
    z.object({
      currency: z.enum(currencies),
      name: z.string(),
      description: z.string(),
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

export const createCheckout = createServerAction()
  .input(z.object({ productId: z.string(), email: z.string().nonempty() }))
  .onError(console.log)
  .handler(async ({ input }) => {
    const domain = await getDomain()

    const user = await createOrFindUser(input.email, { username: input.email.split('@')[0] })
    if (!user) throw new Error('User is required')

    const product = await db.product.findOne({ _id: input.productId })
    if (!product) throw new Error('Not found')
    await db.product.updateOne({ _id: product._id }, { $push: { sales: { user: user._id, price: product.price } } })

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
    })

    if (!url) throw new Error('Failed to process your request')
    return { url }
  })
