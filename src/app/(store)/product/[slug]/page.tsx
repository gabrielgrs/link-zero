import { getProductBySlug } from '@/actions/product'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Product } from '@/components/product'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const [product, error] = await getProductBySlug({ slug })
  if (error) throw error

  return (
    <div>
      <main className='mx-auto max-w-5xl p-8'>
        <Product {...product} />
      </main>
      <footer className='flex justify-center items-center gap-2 text-muted-foreground'>
        Powered by{' '}
        <Link href='/'>
          <Logo />
        </Link>
      </footer>
    </div>
  )
}
