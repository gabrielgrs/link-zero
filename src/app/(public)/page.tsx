import { getRandomProducts } from '@/actions/product'
import { HomeClient } from './client'

async function getProducts() {
  const [products, err] = await getRandomProducts()
  if (err) return []
  return products
}

export default async function Page() {
  const products = await getProducts()

  return <HomeClient products={products} />
}
