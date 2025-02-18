'use client'

import { getRandomProducts } from '@/actions/product'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Product } from '@/components/product'
import { buttonVariants } from '@/components/ui/button'
import { ServerActionResponse } from '@/utils/action'
import { cn } from '@/utils/cn'
import { APP_DESCRIPTION, APP_NAME, CONTACT_EMAIL } from '@/utils/constants/brand'
import { PLATFORM_FEE } from '@/utils/constants/pricing'
import { ArrowRight, ExternalLink } from 'lucide-react'
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
      <header className='flex justify-between px-4 border-b bg-background/90 backdrop-blur-lg z-50 h-16 items-center sticky top-0'>
        <Link href='/'>
          <Logo />
        </Link>
        <nav className='flex items-center text-muted-foreground text-sm h-full'>
          <Link
            href='/#pricing'
            className='h-full flex items-center border-r border-l px-4 hover:text-primary duration-500'
          >
            Pricing
          </Link>
          <Link href='/#faq' className='h-full flex items-center border-r px-4 hover:text-primary duration-500'>
            faq
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='h-full flex items-center border-r px-4 hover:text-primary duration-500'
          >
            Theme
          </button>
          <Link href='/dashboard' className={cn(buttonVariants(), 'group ml-4')}>
            Dashboard <ArrowRight size={16} className='duration-500 group-hover:translate-x-2' />
          </Link>
        </nav>
      </header>
      <main>
        <section className='grid grid-cols-1 md:grid-cols-2 items-center gap-2 min-h-[40vh] py-12 mx-auto max-w-7xl px-2'>
          <div className='space-y-4 py-8'>
            <p>Badge</p>
            <h1>{APP_DESCRIPTION}</h1>
            <div className='flex items-center gap-4'>
              <Link href='/dashboard' className={buttonVariants()}>
                Start selling
              </Link>
              <Link href='/contact' className={buttonVariants({ variant: 'secondary' })}>
                Get in touch
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

        <section
          id='pricing'
          className='flex items-center justify-center flex-col py-10 gap-2 text-center bg-accent text-accent-foreground'
        >
          <span className='text-lg'>Pricing</span>
          <p className='font-semibold max-w-lg mx-auto flex items-end gap-2'>
            <span className='text-2xl md:text-5xl'>
              {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(PLATFORM_FEE / 100)}
            </span>
            / per transaction
          </p>
          <p className='flex items-center gap-1'>
            {' '}
            + Stripe fees{' '}
            <Link href='https://stripe.com/pricing' target='_blank' className='text-xs'>
              (click here to learn more <ExternalLink size={12} />)
            </Link>
          </p>
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
