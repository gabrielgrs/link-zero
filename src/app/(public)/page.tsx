import { getLandingPageData } from '@/actions/shared'
import { HomeClient } from './client'

export const revalidate = 3_600 // 1 hour

export default async function Page() {
  // const products = await getProducts()
  const [data, err] = await getLandingPageData()
  if (err) throw err

  return <HomeClient totalUsers={data.totalUsers} totalProducts={data.totalProducts} totalSales={data.totalSales} />
}
