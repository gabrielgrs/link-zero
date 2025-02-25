'use client'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { APP_NAME } from '@/utils/constants/brand'
import { PLATFORM_FEE } from '@/utils/constants/pricing'
import { ArrowRight } from 'lucide-react'
import { Filters } from './filters'

type Props = {
  // products: ServerActionResponse<typeof getRandomProducts>
  totalUsers: number
  totalProducts: number
  totalSales: number
}

export function HomeClient({ totalUsers, totalProducts, totalSales }: Props) {
  return (
    <main className='space-y-10'>
      <section className='text-center space-y-4'>
        <span className='font-semibold'>{APP_NAME}</span>

        <div>
          <p className='text-muted-foreground'>
            Only <span className='text-primary font-semibold'>{PLATFORM_FEE / 100} dollar</span> per sale
          </p>
          <Link
            href='https://stripe.com/pricing'
            className='text-center text-xs flex justify-self-center'
            target='_blank'
          >
            + <span className='underline underline-offset-2'> Stripe Fees</span>
          </Link>
        </div>

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

      <Filters />
    </main>
  )
}
