import { getProductBySlug } from '@/actions/product'
import { ProductForm } from '../client'

type Props = {
  params: Promise<{ slug: string }>
}
export default async function Page({ params }: Props) {
  const { slug } = await params
  const [product, err] = await getProductBySlug({ slug })
  if (err) throw err

  return (
    <ProductForm
      initialValues={{
        _id: product._id,
        currency: product.currency,
        description: product.description,
        name: product.name,
        price: product.price,
        file: '',
      }}
    />
  )
}
