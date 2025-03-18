'use client'

import { getProductsByQuery } from '@/actions/product'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { ServerActionResponse } from '@/utils/action'
import { categories } from '@/utils/categories'
import { formatCurrency } from '@/utils/currency'
import { motion } from 'motion/react'
import Image from 'next/image'

type Props = {
  product: Pick<
    ServerActionResponse<typeof getProductsByQuery>[number],
    '_id' | 'name' | 'cover' | 'slug' | 'price' | 'currency' | 'category' | 'description' | 'user'
  >
  index: number
}

export function ProductCard({ product, index }: Props) {
  return (
    <motion.div
      layoutId={product._id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: [10, 0] }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      key={product._id}
      className='group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md'
    >
      <div className='relative aspect-video overflow-hidden bg-gray-100'>
        <Image
          src={product.cover || '/thumb.png'}
          width={300}
          height={200}
          alt={product.name}
          className='object-cover transition-transform group-hover:scale-105'
        />
        <div className='absolute top-2 right-2 rounded-full bg-white px-2 py-1 text-xs font-medium'>
          {categories[product.category]}
        </div>
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-lg truncate'>{product.name}</h3>
        <p className='mt-1 text-sm text-gray-500 truncate'>{product.description}</p>
        <div className='mt-3 flex items-center justify-between'>
          <span className='font-bold text-lg'>{formatCurrency(product.price, 'USD')}</span>
          <div className='flex items-center text-sm text-gray-500'>
            <span>by</span>
            <Link
              href={`/user/${product.user.username}`}
              className='ml-1 font-medium text-accent px-2 text-sm rounded-lg'
            >
              {product.user.username}
            </Link>
          </div>
        </div>
        <Link href={`/product/${product.slug}`} className={buttonVariants({ variant: 'accent', className: 'w-full' })}>
          Check it out
        </Link>
      </div>
    </motion.div>
  )
}
