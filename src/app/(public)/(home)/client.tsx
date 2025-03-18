'use client'
import { getRandomProducts } from '@/actions/product'
import { ServerActionResponse } from '@/utils/action'

import { CTABanner } from './cta-banner'
import { Footer } from './footer'
import { Hero } from './hero'
import { HowItWorks } from './how-it-works'
import { Products } from './products'

export function HomeClient({ products }: { products: ServerActionResponse<typeof getRandomProducts> }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <Hero />

        <Products products={products} />

        <HowItWorks />

        <CTABanner />
      </main>

      <Footer />
    </div>
  )
}
