import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export function CTABanner() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-accent-foreground/90 text-white'>
      <div className=' px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>Ready to start selling?</h2>
            <p className='mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Join thousands of creators who are making a living selling digital products online.
            </p>
          </div>
          <div className='mx-auto w-full max-w-sm space-y-2'>
            <Link href='/dashboard' className={cn(buttonVariants({ variant: 'accent' }), 'text-lg  max-w-lg mx-auto')}>
              Sign up for free
            </Link>
            <p className='text-sm text-gray-300'>No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  )
}
