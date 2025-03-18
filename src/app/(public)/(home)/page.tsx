import { getRandomProducts } from '@/actions/product'
import { HomeClient } from './client'

export default async function Home() {
  const [products, error] = await getRandomProducts({ limit: 10 })
  if (error) throw error

  return <HomeClient products={products} />
}
