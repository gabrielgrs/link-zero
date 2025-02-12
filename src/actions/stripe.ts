'use server'

import { db } from '@/libs/mongoose'
import stripeClient from '@/libs/stripe'
import { currencies } from '@/utils/constants/currencies'
import { headers } from 'next/headers'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { createOrFindUser } from './auth'
import { authProcedure } from './procedures'

export async function getDomain() {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const headersData = await headers()
  const host = headersData.get('host')
  return `${protocol}://${host}`
}

export const createProductAndPrice = authProcedure
  .input(
    z.object({
      currency: z.enum(currencies),
      name: z.string(),
      description: z.string(),
      cover: z.string(),
      price: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const createdProduct = await stripeClient.products.create({
      name: input.name,
      description: input.description,
      images: [input.cover],
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
  .handler(async ({ input }) => {
    const domain = await getDomain()

    const user = await createOrFindUser(input.email, { username: input.email.split('@')[0] })
    if (!user) throw new Error('User is required')

    const product = await db.product.findOne({ _id: input.productId })
    if (!product) throw new Error('Not found')

    const { url } = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: user._id,
      success_url: `${domain}/subscription?type=success`,
      cancel_url: `${domain}/subscription?type=failure`,
      mode: 'payment',
      currency: product.currency,
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
      customer: user.stripeCustomerId,
      metadata: {
        productId: product._id,
      },
    })

    if (!url) throw new Error('Failed to process your request')
    return { url }
  })
