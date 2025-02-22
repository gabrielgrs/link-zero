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

// export const createProductAndPrice = authProcedure
//   .input(
//     z.object({
//       currency: z.enum(currencies),
//       name: z.string(),
//       description: z.string().optional(),
//       cover: z.string().optional(),
//       price: z.number(),
//     }),
//   )
//   .handler(async ({ input }) => {
//     const createdProduct = await stripeClient.products.create({
//       name: input.name,
//       description: input.description,
//       images: input.cover ? [input.cover] : [],
//     })

//     const createdPrice = await stripeClient.prices.create({
//       currency: input.currency,
//       nickname: input.name,
//       unit_amount: input.price,
//       product: createdProduct.id,
//     })

//     return {
//       productId: createdProduct.id,
//       priceId: createdPrice.id,
//     }
//   })

// export const updateProductAndPrice = authProcedure
//   .input(
//     z.object({
//       name: z.string().nonempty(),
//       description: z.string().optional(),
//       cover: z.string().optional(),
//       stripeProductId: z.string().nonempty(),
//       stripePriceId: z.string().nonempty(),
//     }),
//   )
//   .handler(async ({ input }) => {
//     await stripeClient.products.update(input.stripeProductId, {
//       name: input.name,
//       description: input.description,
//       images: input.cover ? [input.cover] : [],
//     })

//     await stripeClient.prices.update(input.stripePriceId, {
//       nickname: input.name,
//     })
//   })

// export const activeOrInactiveProductAndPrice = authProcedure
//   .input(
//     z.object({
//       stripeProductId: z.string().nonempty(),
//       stripePriceId: z.string().nonempty(),
//       active: z.boolean(),
//     }),
//   )
//   .handler(async ({ input }) => {
//     try {
//       await stripeClient.products.update(input.stripeProductId, {
//         active: input.active,
//       })

//       await stripeClient.prices.update(input.stripePriceId, {
//         active: input.active,
//       })

//       return true
//     } catch {
//       return false
//     }
//   })

// export const linkAccount = authProcedure.handler(async () => {
//   const domain = await getDomain()

//   const response = await stripeClient.oauth.authorizeUrl({
//     response_type: 'code',
//     client_id: process.env.STRIPE_CLIENT_ID,
//     scope: 'read_write',
//     redirect_uri: `${domain}/api/stripe/oauth/callback`,
//   })

//   return parseData({
//     url: response,
//   })
// })

// export const linkStripeAccountByCode = authProcedure
//   .input(z.object({ code: z.string().nonempty() }))
//   .handler(async ({ input, ctx }) => {
//     const response = await stripeClient.oauth.token({
//       grant_type: 'authorization_code',
//       code: input.code,
//     })

//     await db.user.findOneAndUpdate(
//       { _id: ctx.user._id, stripeAccountId: null },
//       { stripeAccountId: response.stripe_user_id },
//     )

//     return true
//   })

// export async function getCurrencyPriceInCents(from: Currency, to: Currency) {
//   if (from === to) return 1

//   const fromTo = `${from.toUpperCase()}-${to.toUpperCase()}`
//   const url = `https://economia.awesomeapi.com.br/json/last/${fromTo}`

//   const response = await fetch(url, {
//     next: {
//       revalidate: 60 * 10, // 10 minutes
//     },
//   })

//   const json: Record<string, { high: string }> = await response.json()
//   const item = json[fromTo.replace('-', '')]
//   return Number(item.high.replace('.', '').slice(0, 3))
// }

// export const createCheckout = authProcedure
//   .input(z.object({ productId: z.string(), email: z.string().nonempty() }))
//   .handler(async ({ input }) => {
//     const domain = await getDomain()

//     const user = await createOrFindUser(input.email, { username: input.email.split('@')[0] })
//     if (!user) throw new Error('User is required')

//     const product = await db.product.findOne({ _id: input.productId }).populate<{ user: UserSchema }>('user').lean()
//     if (!product) throw new Error('Not found')
//     await db.product.updateOne({ _id: product._id }, { $push: { sales: { user: user._id, price: product.price } } })

//     if (!product.user.stripeAccountId) throw new Error('User is not connected to stripe')

//     const convertedCurrency = await getCurrencyPriceInCents('USD', product.currency)

//     const applicationFeeAmount = (PLATFORM_FEE * convertedCurrency) / 100

//     const { url } = await stripeClient.checkout.sessions.create({
//       payment_method_types: ['card'],
//       client_reference_id: user._id.toString(),
//       success_url: `${domain}/subscription?type=success`,
//       cancel_url: `${domain}/subscription?type=failure`,
//       mode: 'payment',
//       currency: product.currency.toLowerCase(),
//       line_items: [{ price: product.stripePriceId, quantity: 1 }],
//       customer: user.stripeCustomerId,
//       metadata: {
//         productId: product._id.toString(),
//       },
//       payment_intent_data: {
//         application_fee_amount: applicationFeeAmount,
//         transfer_data: {
//           destination: product.user.stripeAccountId,
//         },
//       },
//     })

//     if (!url) throw new Error('Failed to process your request')
//     return { url }
//   })
