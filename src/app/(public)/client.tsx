'use client'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { APP_NAME } from '@/utils/constants/brand'
import { PLATFORM_FEE } from '@/utils/constants/pricing'
import { formatCurrency } from '@/utils/currency'
import { ArrowRight } from 'lucide-react'
import { CategoriesSection } from './categories-section'

type Props = {
  // products: ServerActionResponse<typeof getRandomProducts>
  totalUsers: number
  totalProducts: number
  totalSales: number
}

export function HomeClient({ totalUsers, totalProducts, totalSales }: Props) {
  return (
    <main className='space-y-20'>
      <section className='text-center space-y-8'>
        <span className='font-semibold'>{APP_NAME}</span>

        <p className='text-muted-foreground'>Only {formatCurrency(PLATFORM_FEE, 'USD')} / transaction</p>

        <div className='flex justify-center'>
          <Link href='/dashboard' className={buttonVariants()}>
            Start making money <ArrowRight size={16} />
          </Link>
        </div>

        <div className='flex justify-around mx-auto max-w-lg'>
          <div className='text-center'>
            <p className='text-2xl'>{totalUsers}</p>
            <p className='text-sm text-muted-foreground'>Users</p>
          </div>
          <div className='h-12 w-0.5 bg-foreground/5' />
          <div className='text-center'>
            <p className='text-2xl'>{totalProducts}</p>
            <p className='text-sm text-muted-foreground'>Products</p>
          </div>
          <div className='h-12 w-0.5 bg-foreground/5' />
          <div>
            <p className='text-2xl'>{totalSales}</p>
            <p className='text-sm text-muted-foreground'>Sales</p>
          </div>
        </div>
      </section>

      <hr />

      <CategoriesSection />
    </main>
  )
}
