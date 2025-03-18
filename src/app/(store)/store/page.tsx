import { getProductsByQuery } from '@/actions/product'
import { Filters } from '@/app/(public)/filters'
import { Link } from '@/components/link'
import { ProductCard } from '@/components/product-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ArrowLeft } from 'lucide-react'

type Props = {
  searchParams: Promise<{ searchText?: string; category?: string }>
}
export default async function Page({ searchParams }: Props) {
  const { searchText, category } = await searchParams
  const [products, error] = await getProductsByQuery({
    category: category ? category.toUpperCase() : '',
    searchText,
  })
  if (error) throw error

  return (
    <div className='space-y-14'>
      <Link href='/' className={cn(buttonVariants({ variant: 'outline' }), 'w-max')}>
        <ArrowLeft size={16} /> Back to home
      </Link>

      <Filters initialValues={{ searchText, category: category ? category.toUpperCase() : undefined }} />

      {products.length === 0 && (
        <p className='text-lg text-muted-foreground text-center'>Nothing found. Try another category!</p>
      )}
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}
