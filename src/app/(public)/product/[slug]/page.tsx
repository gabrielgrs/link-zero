import { getProductBySlug } from '@/actions/product'
import { ProductClient } from '../client'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const [product, error] = await getProductBySlug({ slug })
  if (error) throw error
  if (!product.active) return <h1 className='text-center'>Product not found</h1>

  return <ProductClient product={product} />
}
