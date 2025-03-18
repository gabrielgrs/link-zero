'use client'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const steps: { title: string; description: string; image: string; list?: string[] }[] = [
  {
    title: 'Register and Set Up Your Account',
    image: '/thumb.png',
    description:
      'Sign up in just a few clicks and access your dashboard. Customize your profile and get ready to start selling digital products.',
    list: ['Quick and easy registration', 'Secure user dashboard', 'Personalized settings'],
  },
  {
    title: 'Connect Your Stripe Account',
    image: '/thumb.png',
    description:
      'Link your Stripe account to start receiving payments instantly. Our integration ensures fast and secure transactions for every sale.',
    list: ['Seamless Stripe integration', 'Instant payouts', 'Safe and secure transactions'],
  },
  {
    title: 'Create, Share, and Sell',
    image: '/thumb.png',
    description:
      'Upload your digital products, generate a unique link, and start selling. Share your link anywhere and let Link Zero handle the rest.',
    list: ['Upload digital products', 'Generate shareable links', 'Sell on any platform'],
  },
]

const DURATION_IN_MILLISECONDS = 5000

export function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0)
  const interval = useRef<NodeJS.Timeout>(null)

  const current = steps[currentStep]

  useEffect(() => {
    interval.current = setInterval(() => {
      setCurrentStep((currentStep + 1) % steps.length)
    }, DURATION_IN_MILLISECONDS)

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [currentStep])

  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-accent/5'>
      <div className='px-4'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
          <div className='flex flex-col justify-center space-y-4'>
            {current && (
              <motion.div
                key={String(currentStep)}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='space-y-2'
              >
                <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-[#2d2a0f]'>
                  {currentStep + 1}. {current.title}
                </h2>
                <p className='max-w-[600px] text-muted-foreground text-md'>{current.description}</p>
                {current.list && (
                  <ul className='grid gap-2'>
                    {current.list.map((item) => {
                      return (
                        <li className='flex items-center gap-2' key={item}>
                          <Check className='h-5 w-5 text-accent' />
                          <span>{item}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </motion.div>
            )}
            <div className='flex flex-col gap-2 min-[400px]:flex-row'>
              <Link href='/' className={buttonVariants({ variant: 'accent' })}>
                Start creating
              </Link>
              <Link href='/help' className={buttonVariants({ variant: 'outline' })}>
                Learn more
              </Link>
            </div>
          </div>
          <div className='mx-auto w-full max-w-lg space-y-4'>
            <motion.div
              key={String(currentStep)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='w-full rounded-xl border bg-background p-4'
            >
              <Image src={current.image} alt={current.title} width={512} height={512} />
            </motion.div>
            <div className='flex items-center gap-1 w-full max-w-36 mx-auto'>
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => {
                    setCurrentStep(index)
                    if (interval.current) clearInterval(interval.current)
                  }}
                  className={cn(
                    'text-sm w-full h-3 rounded-full duration-500',
                    current.title === step.title ? 'bg-primary' : 'bg-foreground/50 w-8',
                  )}
                >
                  {null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
