import { getProductBySlug } from '@/actions/product'
import { generateMetadata as generateMetadataFn, thumbImage } from '@/utils/metadata'
import { Metadata } from 'next'
import { ProductClient } from '../client'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const [product, error] = await getProductBySlug({ slug })
  if (error) throw error

  const initialMetadata = { ...generateMetadataFn(), title: product.name }

  return {
    ...initialMetadata,
    openGraph: {
      ...initialMetadata.openGraph,
      images: [product.cover || thumbImage],
    },
    twitter: {
      ...initialMetadata.twitter,
      images: [product.cover || thumbImage],
    },
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const [product, error] = await getProductBySlug({ slug })
  if (error) throw error
  if (product.status !== 'PUBLISHED') return <h1 className='text-center'>Product not found</h1>

  return <ProductClient product={product} />
}
