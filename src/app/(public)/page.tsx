import { getLandingPageData } from '@/actions/shared'
import { HomeClient } from './client'

// async function getProducts() {
//   const [products, err] = await getRandomProducts()
//   if (err) return []
//   return products
// }

export default async function Page() {
  // const products = await getProducts()
  const [data, err] = await getLandingPageData()
  if (err) throw err

  return <HomeClient totalUsers={data.totalUsers} totalProducts={data.totalProducts} totalSales={data.totalSales} />
}
