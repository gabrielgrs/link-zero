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
