'use client'

import { getProductsByCategory } from '@/actions/product'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { ServerActionResponse } from '@/utils/action'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/currency'

export function ProductCard({ product }: { product: ServerActionResponse<typeof getProductsByCategory>[number] }) {
  return (
    <div className='border shadow bg-background rounded-lg relative'>
      <div
        className={cn('h-32 bg-foreground/5 w-full rounded-t-lg')}
        style={{
          backgroundImage: `url(${product.cover})`,
          objectFit: 'cover',
          objectPosition: 'center',
          backgroundSize: '100%',
        }}
      />
      <p className='backdrop-blur-lg font-semibold px-1 rounded-sm border border-accent-foreground text-accent-foreground absolute top-1 right-1 text-sm w-max'>
        {product.content.format}
      </p>
      <div className='px-2 space-y-2 py-3'>
        <div>
          <p>{product.name}</p>
          <Link href={`/user/${product.user.username}`}>{product.user.name}</Link>
        </div>
        <Link href={`/product/${product.slug}`} className={buttonVariants()}>
          Buy now for just {formatCurrency(product.price, product.currency)}
        </Link>
      </div>
    </div>
  )
}
