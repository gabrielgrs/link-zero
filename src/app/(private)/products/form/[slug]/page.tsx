import { getProductBySlugWithContent } from '@/actions/product'
import { ProductForm } from '../client'

type Props = {
  params: Promise<{ slug: string }>
}
export default async function Page({ params }: Props) {
  const { slug } = await params
  const [product, err] = await getProductBySlugWithContent({ slug })
  if (err) throw err

  return (
    <ProductForm
      initialValues={{
        _id: product._id,
        category: product.category,
        cover: product.cover,
        currency: product.currency,
        description: product.description,
        name: product.name,
        price: product.price,
        slug: product.slug,
        details: product.details,
        url: product.content.url,
        file: '',
      }}
    />
  )
}
