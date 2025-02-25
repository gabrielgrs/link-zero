'use client'

import { getProductsByQuery } from '@/actions/product'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { ServerActionResponse } from '@/utils/action'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/currency'
import { motion } from 'motion/react'

type Props = {
  product: Pick<
    ServerActionResponse<typeof getProductsByQuery>[number],
    '_id' | 'name' | 'cover' | 'slug' | 'price' | 'currency'
  >
  user: {
    username: string
    name: string
  }
  index: number
}

export function ProductCard({ product, user, index }: Props) {
  return (
    <motion.div
      layoutId={product._id}
      key={product._id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: [10, 0] }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className='border shadow bg-background rounded-lg relative'
    >
      <div
        className={cn('h-32 bg-foreground/5 w-full rounded-t-lg')}
        style={{
          backgroundImage: `url(${product.cover})`,
          objectFit: 'cover',
          objectPosition: 'center',
          backgroundSize: '100%',
        }}
      />

      <div className='px-2 space-y-2 py-3'>
        <div>
          <p>{product.name}</p>
          <Link href={`/user/${user.username}`}>{user.name}</Link>
        </div>
        <Link href={`/product/${product.slug}`} className={buttonVariants()}>
          Buy now for just {formatCurrency(product.price, product.currency)}
        </Link>
      </div>
    </motion.div>
  )
}
