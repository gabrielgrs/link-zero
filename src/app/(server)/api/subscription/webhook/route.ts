import { db } from '@/libs/mongoose'
import stripeClient from '@/libs/stripe'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

async function checkoutSessionComplete(session: Stripe.Checkout.Session) {
  const user = await db.user.findOneAndUpdate(
    { stripeCustomerId: session.client_reference_id },
    { stripeSubscriptionId: session.subscription! },
  )
  if (!user) throw new Error('Checkout not found')
  return NextResponse.json({ received: true }, { status: 200 })
}

async function customerSubscriptionDeleted({ id: subscriptionId }: Stripe.Subscription) {
  const user = await db.user.findOneAndUpdate({ stripeSubscriptionId: subscriptionId }, { subscriptionId: undefined })
  if (!user) throw new Error('Subscription not found')

  return NextResponse.json({ received: true }, { status: 200 })
}

export async function POST(req: Request) {
  try {
    const requestText = await req.text()
    const signature = req.headers.get('Stripe-Signature')!
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    const event = stripeClient.webhooks.constructEvent(requestText, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      return checkoutSessionComplete(event.data.object)
    }

    if (event.type === 'customer.subscription.deleted') {
      return customerSubscriptionDeleted(event.data.object)
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: false }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ message: 'Working' })
}
