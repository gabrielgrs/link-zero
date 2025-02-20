import { getProductsByCategory } from '@/actions/product'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ArrowLeft } from 'lucide-react'
import { CategoriesSection } from '../../categories-section'
import { ProductCard } from './product-card'

type Props = {
  params: Promise<{ category: string }>
}
export default async function Page({ params }: Props) {
  const { category } = await params
  const [products, error] = await getProductsByCategory({ category: category.toUpperCase() })
  if (error) throw error

  return (
    <div className='space-y-14'>
      <Link href='/' className={cn(buttonVariants({ variant: 'outline' }), 'w-max')}>
        <ArrowLeft size={16} /> Voltar para home
      </Link>
      <CategoriesSection selectedCategory={category} />
      {products.length === 0 && (
        <p className='text-lg text-muted-foreground text-center'>Nothing found. Try another category!</p>
      )}
      <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
