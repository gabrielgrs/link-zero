'use client'

import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { APP_NAME } from '@/utils/constants/brand'
import { PLATFORM_FEE } from '@/utils/constants/pricing'
import { formatCurrency } from '@/utils/currency'
import { ArrowRight, Check, DollarSign, Github, Twitter, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { ProductSearch } from '../product-search'

function PricingTable() {
  return (
    <Card className='w-full p-4'>
      <div className='font-mono text-sm lg:text-base space-y-3'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Sales amount:</span>
          <span className='text-foreground font-semibold'>{formatCurrency(99_00, 'USD')}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{APP_NAME} tax:</span>
          <span className='text-primary font-semibold'>-{formatCurrency(PLATFORM_FEE, 'USD')}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Stripe tax (3.99%):</span>
          <span className='text-primary font-semibold'>-{formatCurrency(99_00 * 0.0399, 'USD')}</span>
        </div>
        <div className='h-px bg-border my-2' />
        <div className='flex justify-between text-lg opacity-80 text-bold'>
          <span>Competitor earnings:</span>
          <span>{formatCurrency(99_00 - PLATFORM_FEE - 99_00 * 0.1, 'USD')}</span>
        </div>
        <div className='flex justify-between text-lg font-bold text-accent'>
          <span>{APP_NAME} earnings:</span>
          <span>{formatCurrency(99_00 - PLATFORM_FEE - 99_00 * 0.0399, 'USD')}</span>
        </div>
      </div>
      {/* <p className='text-xs text-muted-foreground mt-4 font-mono'>// </p> */}
    </Card>
  )
}

function Hero() {
  return (
    <section className='py-10 flex flex-col items-center mx-auto max-w-3xl gap-4'>
      <Badge
        className='mb-6 gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
        variant='outline'
      >
        <Zap className='h-3.5 w-3.5' />
        Start selling as never before
      </Badge>

      <h1 className='text-5xl sm:text-6xl lg:text-8xl font-black text-center'>
        <span className='text-foreground'>sell</span> <span className='text-muted-foreground'>digital products</span>
      </h1>

      <p className='text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8'>
        The e-commerce platform built for sellers. Pay exactly{' '}
        <span className='text-primary font-semibold'>$1 per sale</span> plus <span>Stripe fees</span> — whether you sell
        for $10 or $10,000.
      </p>

      <div className='mt-6 flex gap-4'>
        <Link href='/auth' className={buttonVariants({ variant: 'accent', className: 'h-12' })}>
          <DollarSign />
          Start Selling
        </Link>
        <ProductSearch />
      </div>

      <PricingTable />
    </section>
  )
}

type Step = {
  title: string
  description: string
  image: string
}

const steps: Step[] = [
  {
    title: 'Configure your account',
    description: 'Link your account to Stripe to start selling',
    image: '/images/steps/configure-account.png',
  },
  {
    title: 'Create your first product',
    description: 'Create your first product to start selling',
    image: '/images/steps/create-product.png',
  },
  {
    title: 'Share and get paid',
    description: 'Share your product and get paid',
    image: '/images/steps/share-product.png',
  },
]

function Features() {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  return (
    <section id='features' className='relative py-24 grid grid-cols-2 gap-10'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent scale-110' />

      <div>
        {steps.map((step, index) => (
          <button
            key={index}
            className='grid grid-cols-[max-content,auto] gap-4 relative p-2 text-left w-full'
            onClick={() => setCurrentStep(index)}
          >
            {currentStep === index && (
              <motion.div className='absolute inset-0 bg-primary/10 rounded-lg' layoutId='step-indicator' />
            )}
            <span className='text-muted-foreground font-semibold'>{index + 1}.</span>
            <div>
              <h2>{step.title}</h2>
              <p className='text-muted-foreground text-sm'>{step.description}</p>
            </div>
          </button>
        ))}
      </div>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5 }}
      >
        <Image src={step.image} alt={step.title} width={100} height={100} />
      </motion.div>
    </section>
  )
}

export function HomeClient() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Hero />

      <Features />

      <section id='pricing' className='relative py-24'>
        <div className='container mx-auto px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl lg:text-6xl font-black mb-4'>Do The Math</h2>
            <p className='text-lg text-muted-foreground'>Compare how much you actually keep with {APP_NAME}</p>
          </div>

          <div className='grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
            {/* Other Platform */}
            <Card className='p-6 bg-card/30 backdrop-blur border-destructive/20'>
              <h3 className='text-lg font-bold mb-4 text-muted-foreground'>Other Platforms</h3>
              <div className='font-mono text-sm space-y-2 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Sale:</span>
                  <span className='text-foreground'>$100.00</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Fee (15%):</span>
                  <span className='text-destructive'>-$15.00</span>
                </div>
                <div className='h-px bg-border my-2' />
                <div className='flex justify-between text-base'>
                  <span className='font-bold'>Keep:</span>
                  <span className='font-bold text-foreground'>$85.00</span>
                </div>
              </div>
              <Badge variant='outline' className='w-full justify-center border-destructive/30 text-destructive'>
                15% gone forever
              </Badge>
            </Card>

            {/* SellOne - Highlighted */}
            <Card className='p-6 bg-primary/10 backdrop-blur border-primary shadow-lg shadow-primary/20 relative'>
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-none'>
                Best Value
              </Badge>
              <h3 className='text-lg font-bold mb-4'>{APP_NAME}</h3>
              <div className='font-mono text-sm space-y-2 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Sale:</span>
                  <span className='text-foreground'>$100.00</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Fee:</span>
                  <span className='text-primary'>-$1.00</span>
                </div>
                <div className='h-px bg-border my-2' />
                <div className='flex justify-between text-base'>
                  <span className='font-bold'>Keep:</span>
                  <span className='font-bold text-secondary text-xl'>$99.00</span>
                </div>
              </div>
              <Badge variant='outline' className='w-full justify-center border-primary/30 text-primary bg-primary/10'>
                Save $14 per sale
              </Badge>
            </Card>

            {/* High Volume */}
            <Card className='p-6 bg-card/30 backdrop-blur border-secondary/20'>
              <h3 className='text-lg font-bold mb-4'>1000 Sales @ $100</h3>
              <div className='font-mono text-sm space-y-2 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Revenue:</span>
                  <span className='text-foreground'>$100,000</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Others:</span>
                  <span className='text-destructive'>-$15,000</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>{APP_NAME}:</span>
                  <span className='text-primary'>-$1,000</span>
                </div>
                <div className='h-px bg-border my-2' />
                <div className='flex justify-between text-base'>
                  <span className='font-bold'>Save:</span>
                  <span className='font-bold text-secondary text-xl'>$14,000</span>
                </div>
              </div>
              <Badge variant='outline' className='w-full justify-center border-secondary/30 text-secondary'>
                14x better value
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      <section id='community' className='relative py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent' />
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-3xl' />

        <div className='container relative mx-auto px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <Badge className='mb-6 gap-1.5 bg-primary/10 text-primary border-primary/20' variant='outline'>
              <Zap className='h-3.5 w-3.5' />
              By sellers, for sellers
            </Badge>
            <h2 className='text-4xl lg:text-6xl font-black mb-4'>Built by the Community</h2>
            <p className='text-lg lg:text-xl text-muted-foreground text-balance max-w-3xl mx-auto'>
              {APP_NAME} is built by sellers who understand your pain. These are some of us who have transitioned to
              simpler, transparent pricing.
            </p>
          </div>

          {/* Stats */}
          <div className='grid sm:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto'>
            <div className='text-center'>
              <div className='text-5xl lg:text-6xl font-black text-primary mb-2'>50K+</div>
              <p className='text-muted-foreground font-medium'>Active Sellers</p>
            </div>
            <div className='text-center'>
              <div className='text-5xl lg:text-6xl font-black text-secondary mb-2'>2M+</div>
              <p className='text-muted-foreground font-medium'>Sales Processed</p>
            </div>
            <div className='text-center'>
              <div className='text-5xl lg:text-6xl font-black text-accent mb-2'>$500M</div>
              <p className='text-muted-foreground font-medium'>Seller Revenue</p>
            </div>
          </div>

          {/* Avatar Grid */}
          <div className='flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-12'>
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className='h-12 w-12 rounded-full bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 border-2 border-border/50 hover:scale-110 transition-transform cursor-pointer'
                style={{
                  background: `linear-gradient(135deg, 
                    oklch(${0.5 + (i % 3) * 0.15} ${0.15 + (i % 2) * 0.05} ${(i * 37) % 360}) 0%,
                    oklch(${0.4 + (i % 4) * 0.1} ${0.2} ${(i * 73 + 120) % 360}) 100%
                  )`,
                }}
              />
            ))}
          </div>

          <div className='text-center'>
            <Button size='lg' variant='outline' className='gap-2 bg-card hover:bg-muted'>
              <Github className='h-5 w-5' />
              Join the Discord
            </Button>
          </div>
        </div>
      </section>

      <section className='relative py-32 overflow-hidden'>
        <div className='absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-secondary/20 via-primary/10 to-transparent blur-3xl' />

        <div className='container relative mx-auto px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-4xl sm:text-5xl lg:text-7xl font-black mb-6 text-pretty leading-[0.95]'>
              Ready to keep
              <br />
              <span className='text-primary'>more money?</span>
            </h2>
            <p className='text-lg lg:text-xl text-muted-foreground mb-10 text-balance max-w-2xl mx-auto leading-relaxed'>
              Join thousands of sellers who switched to {APP_NAME} and never looked back. Start selling today with zero
              setup fees.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
              <Button size='lg' className='text-base gap-2'>
                Create Your Store Free
                <ArrowRight className='h-5 w-5' />
              </Button>
              <Button size='lg' variant='outline' className='text-base gap-2 bg-card hover:bg-muted'>
                <Github className='h-5 w-5' />
                View on GitHub
              </Button>
            </div>

            <div className='grid sm:grid-cols-3 gap-6 pt-8 border-t border-border/30'>
              <div className='flex items-center justify-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span className='text-sm text-muted-foreground'>No credit card required</span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span className='text-sm text-muted-foreground'>Setup in 5 minutes</span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                <span className='text-sm text-muted-foreground'>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className='border-t border-border/30 py-12'>
        <div className='container mx-auto px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded bg-primary'>
                <span className='text-sm font-bold text-primary-foreground'>$1</span>
              </div>
              <span className='text-sm font-semibold'>
                Built with ❤️ by <Link href='https://github.com/gabrielgrs'>gabrielgrs</Link>
              </span>
            </div>

            <div className='flex items-center gap-6'>
              <Link href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                Privacy Policy
              </Link>
              <Link href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
                Terms of Service
              </Link>
              <div className='flex gap-4'>
                <button className='text-muted-foreground hover:text-foreground transition-colors'>
                  <Github className='h-5 w-5' />
                </button>
                <button className='text-muted-foreground hover:text-foreground transition-colors'>
                  <Twitter className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>

          <div className='mt-8 pt-8 border-t border-border/30 text-center'>
            <p className='text-xs text-muted-foreground font-mono'>© 2025 SellOne. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
