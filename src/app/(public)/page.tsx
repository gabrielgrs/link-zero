import { getRandomProducts } from '@/actions/product'
import { Link } from '@/components/link'
import { Product } from '@/components/product'
import { Button } from '@/components/ui/button'
import { APP_DESCRIPTION } from '@/utils/constants/brand'
import { Salles } from './salles'

async function getProducts() {
  const [products, err] = await getRandomProducts()
  if (err) return []
  return products
}

export default async function Page() {
  const products = await getProducts()

  return (
    <main>
      <section className='grid grid-cols-1 md:grid-cols-2 items-center gap-2 min-h-[60vh] py-12'>
        <div className='space-y-4 py-8'>
          <p>Badge</p>
          <h1>{APP_DESCRIPTION}</h1>
          <div className='flex items-center gap-4'>
            <Link href='/dashboard'>
              <Button>Start selling</Button>
            </Link>
            <Link href='/contact'>
              <Button variant='secondary'>Get in touch</Button>
            </Link>
          </div>
        </div>
        <Salles />
      </section>

      <section>
        <h1>Recommendations</h1>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          {products.map((p) => (
            <Product key={p._id} {...p} viewAsCard />
          ))}
        </div>
      </section>
    </main>
  )
}
