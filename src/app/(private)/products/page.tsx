import { getUserProducts } from '@/actions/product'
import { ProductsTable } from './table'

export default async function Page() {
  const [products, error] = await getUserProducts()
  if (error) throw error

  return <ProductsTable products={products} />
}
