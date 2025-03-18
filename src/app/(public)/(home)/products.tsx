import { getRandomProducts } from '@/actions/product'
import { Link } from '@/components/link'
import { ProductCard } from '@/components/product-card'
import { buttonVariants } from '@/components/ui/button'
import { ServerActionResponse } from '@/utils/action'
import { Filters } from '../filters'

export function Products({ products }: { products: ServerActionResponse<typeof getRandomProducts> }) {
  return (
    <section className='w-full py-12 md:py-24 bg-gray-50'>
      <div className=' px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center mb-10'>
          <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2a0f]'>
            Discover Digital Products
          </h2>
          <p className='max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
            Browse thousands of high-quality digital products from creators worldwide
          </p>
        </div>

        <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-8'>
          <Filters />
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {products.map((product, index) => {
            return <ProductCard key={product._id} product={product} index={index} />
          })}
        </div>

        <div className='mt-10 flex justify-center'>
          <Link href='/store' className={buttonVariants({ variant: 'accent' })}>
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}
