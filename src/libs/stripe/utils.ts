import { Currency } from '@/utils/constants/currencies'
import stripeClient from './index'

async function createCustomer(email: string) {
  return stripeClient.customers.create({ email })
}

async function findCustomerByEmail(email: string) {
  const customers = await stripeClient.customers.list({ email })
  return customers.data[0]
}

export async function createOrFindCustomerByEmail(email: string) {
  const customer = await findCustomerByEmail(email)
  if (customer) return customer
  return createCustomer(email)
}

export async function findAccountByEmail(email: string) {
  const accounts = await stripeClient.accounts.list()
  const found = accounts.data.find((account) => account.email === email)
  return found?.id
}

type CreateProductData = {
  name: string
  description?: string
  images?: string
}
export async function createProduct(data: CreateProductData) {
  return stripeClient.products.create({
    name: data.name,
    description: data.description,
    images: data.images ? [data.images] : [],
  })
}

type CreatePriceData = {
  currency: string
  nickname: string
  unitAmount: number
}
export async function createPrice(productId: string, data: CreatePriceData) {
  return stripeClient.prices.create({
    currency: data.currency,
    nickname: data.nickname,
    unit_amount: data.unitAmount,
    product: productId,
  })
}

type UpdateProductData = {
  name: string
  description?: string
  image?: string
  active: boolean
}
export async function updateProduct(productId: string, data: Partial<UpdateProductData>) {
  await stripeClient.products.update(productId, {
    name: data.name,
    description: data.description,
    images: data.image ? [data.image] : [],
  })
}

type UpdatePriceData = {
  active: boolean
  nickname: string
}
export async function updatePrice(priceId: string, data: Partial<UpdatePriceData>) {
  return stripeClient.prices.update(priceId, {
    nickname: data.nickname,
  })
}

type Data = {
  userId: string
  customerId: string
  priceId: string
  productId: string
  applicationFeeAmount: number
  destinationAccountId: string
  currency: Currency
  successUrl: string
  cancelUrl: string
}
export async function createCheckoutSession(data: Data) {
  return stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    client_reference_id: data.userId,
    success_url: data.successUrl,
    cancel_url: data.cancelUrl,
    mode: 'payment',
    currency: data.currency.toLowerCase(),
    line_items: [{ price: data.priceId, quantity: 1 }],
    customer: data.customerId,
    metadata: {
      productId: data.productId,
    },
    payment_intent_data: {
      application_fee_amount: data.applicationFeeAmount,
      transfer_data: {
        destination: data.destinationAccountId,
      },
    },
  })
}

export async function getOAuthLink(redirectUrl: string) {
  return stripeClient.oauth.authorizeUrl({
    response_type: 'code',
    client_id: process.env.STRIPE_CLIENT_ID,
    scope: 'read_write',
    redirect_uri: redirectUrl,
  })
}

export async function decodeOAuthToken(code: string) {
  return stripeClient.oauth.token({
    grant_type: 'authorization_code',
    code,
  })
}
