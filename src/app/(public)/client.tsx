'use client'

import { getRandomProducts } from '@/actions/product'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Product } from '@/components/product'
import { Button } from '@/components/ui/button'
import { ServerActionResponse } from '@/utils/action'
import { APP_DESCRIPTION, APP_NAME, CONTACT_EMAIL } from '@/utils/constants/brand'
import { SALE_PERCENTAGE, SALE_PRICE, WITHDRAWAL_FEE } from '@/utils/constants/pricing'
import { ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { FAQ } from './faq'
import { Sales } from './sales'

type Props = {
  products: ServerActionResponse<typeof getRandomProducts>
}

export function HomeClient({ products }: Props) {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <header className='flex justify-between px-4 border-b bg-background/70 backdrop-blur-lg z-50 h-16 items-center sticky top-0'>
        <Logo />
        <nav className='flex items-center gap-4 text-muted-foreground text-sm'>
          <Link href='/#pricing'>Pricing</Link>
          <Link href='/#faq'>FAQ</Link>
          <button type='button' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Theme
          </button>
          <Button>
            <Link href='/dashboard' className='flex items-center gap-2 group'>
              Dashboard <ArrowRight size={16} className='duration-500 group-hover:translate-x-2' />
            </Link>
          </Button>
        </nav>
      </header>
      <main>
        <section className='grid grid-cols-1 md:grid-cols-2 items-center gap-2 min-h-[40vh] py-12 mx-auto max-w-7xl px-2'>
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
          <Sales />
        </section>

        <section className='mx-auto max-w-7xl px-2 py-14'>
          <h1>Recommendations</h1>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {products.map((p) => (
              <Product key={p._id} {...p} viewAsCard />
            ))}
          </div>
        </section>

        <section className='grid grid-cols-2' id='pricing'>
          <div className='col-span-2 bg-yellow-400 text-black text-center px-10 py-20 space-y-4'>
            <span className='text-lg'>Pricing</span>
            <p className='text-2xl md:text-5xl font-semibold max-w-lg mx-auto'>Pay only if you sell</p>
          </div>
          <div className='bg-blue-400 text-black text-center px-10 py-20 space-y-2'>
            <p className='text-2xl md:text-5xl font-semibold max-w-lg mx-auto'>
              {SALE_PERCENTAGE}% +{' '}
              {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(SALE_PRICE / 100)}
            </p>
            <p className='text-lg'>for each sale</p>
          </div>
          <div className='bg-green-400 text-black text-center px-10 py-20 space-y-2'>
            <p className='text-2xl md:text-5xl font-semibold max-w-lg mx-auto'>
              {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(WITHDRAWAL_FEE / 100)}
            </p>
            <p className='text-lg'>Withdrawal Fee</p>
          </div>
        </section>
        <section className='bg-foreground/5' id='faq'>
          <div className=' text-center px-10 py-20 space-y-4'>
            <span className='text-lg'>Frequently asked questions</span>
          </div>

          <FAQ />

          <p className='mx-auto max-w-lg px-4 text-sm text-muted-foreground text-center py-8'>
            Have any doubts? Get in touch via email{' '}
            <Link href={`mailto:${CONTACT_EMAIL}`} className='text-primary underline underline-offset-2'>
              {CONTACT_EMAIL}
            </Link>
          </p>
        </section>
      </main>
      <footer className='border-t p-10'>
        <h2>{APP_NAME}</h2>
        <h3>{APP_DESCRIPTION}</h3>
      </footer>
    </>
  )
}
