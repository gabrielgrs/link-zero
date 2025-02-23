import { db } from '@/libs/mongoose'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import stripeClient from '@/libs/stripe'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

async function checkoutSessionUpdate(
  session: Stripe.Checkout.Session,
  status: ProductSchema['sales'][number]['status'],
) {
  const { client_reference_id: userId, metadata } = session
  const productId = metadata?.productId
  if (!productId) return NextResponse.json({ message: 'Product not found' }, { status: 404 })

  const product = await db.product.findOneAndUpdate(
    { _id: productId, 'sales.user': userId },
    { $set: { 'sales.$.status': 'success' } },
    { new: true },
  )

  const updatedItem = product?.sales.find((sale) => sale.user.toString() === userId && sale.status === status)
  if (!updatedItem) return NextResponse.json({ message: 'Sale not found' }, { status: 404 })

  // if (!user) throw new Error('Checkout not found')
  return NextResponse.json({ received: true }, { status: 200 })
}

async function accountUpdated(session: Stripe.Account) {
  if (!session.metadata) throw new Error('Session metadata not found')

  const updatedUser = await db.user.findOneAndUpdate({
    _id: session.metadata.userId,
    stripeAccountId: session.id,
  })

  if (!updatedUser) throw new Error('User not found')
  return NextResponse.json({ received: true }, { status: 200 })
}

export async function POST(req: Request) {
  try {
    const requestText = await req.text()
    const signature = req.headers.get('Stripe-Signature')!
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    const event = stripeClient.webhooks.constructEvent(requestText, signature, webhookSecret)

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      return checkoutSessionUpdate(event.data.object, 'SUCCESS')
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      return checkoutSessionUpdate(event.data.object, 'FAILURE')
    }

    if (event.type === 'account.updated') {
      return accountUpdated(event.data.object)
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ received: false }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ message: 'Working' })
}
