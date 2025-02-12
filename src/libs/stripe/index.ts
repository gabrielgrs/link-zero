import { Stripe } from 'stripe'

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
})

export default stripeClient
