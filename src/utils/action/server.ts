import { headers } from 'next/headers'

export async function getDomain() {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const headersData = await headers()
  const host = headersData.get('host')
  return `${protocol}://${host}`
}
