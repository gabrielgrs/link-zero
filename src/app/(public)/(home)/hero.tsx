import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { APP_DESCRIPTION } from '@/utils/constants/brand'
import { Check } from 'lucide-react'

export function Hero() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <p className='bg-accent-foreground text-white rounded-lg text-sm px-2 py-0.5 animate-bounce mx-auto max-w-max'>
              Marketing
            </p>
            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-[#2d2a0f]'>
              {APP_DESCRIPTION}
            </h1>
            <div className='flex flex-col items-center justify-center gap-4 py-8 md:flex-row text-base'>
              <div className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-accent' />
                <span>100% Free to use</span>
              </div>
              <div className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-accent' />
                <span>Own store</span>
              </div>
              <div className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-accent' />
                <span>Global marketplace</span>
              </div>
            </div>
            <div className='mx-auto max-w-[600px] py-4'>
              <Link
                href='/dashboard'
                className={cn(buttonVariants({ variant: 'accent' }), 'text-lg  max-w-lg mx-auto')}
              >
                Get started for free
              </Link>
              <p className='mt-4 text-sm text-muted-foreground'>No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
