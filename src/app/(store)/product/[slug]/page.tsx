import { getProductBySlug } from '@/actions/product'
import { ProductClient } from './client'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const [product, error] = await getProductBySlug({ slug, active: true })
  if (error) throw error

  return <ProductClient product={product} />
}
