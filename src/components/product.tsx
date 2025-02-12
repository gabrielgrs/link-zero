'use client'

import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { Link } from './link'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

type Props = Omit<
  ProductSchema,
  '_id' | 'user' | 'sales' | 'stripePriceId' | 'stripeProductId' | 'createdAt' | 'updatedAt'
> & {
  user: UserSchema
  viewAsCard?: boolean
  onSubmit?: (email: string) => void
  isSubmitting?: boolean
  initialEmail?: string
}

export function Product({
  name,
  cover,
  price,
  user,
  content,
  characteristics,
  category,
  currency,
  slug,
  viewAsCard = false,
  initialEmail = '',
  isSubmitting,
  onSubmit,
}: Props) {
  const [email, setEmail] = useState(initialEmail)

  return (
    <div className='border'>
      <div
        className={cn('h-40 bg-foreground/5 w-full', viewAsCard && 'h-24')}
        style={{
          backgroundImage: `url(${cover})`,
          objectFit: 'cover',
          objectPosition: 'center',
          backgroundSize: '100%',
        }}
      />
      <div className={cn('h-20 flex items-center pl-8 border', viewAsCard && 'pl-0 justify-center')}>
        <h1 className={viewAsCard ? 'text-lg' : ''}>{name}</h1>
      </div>
      <div className={cn('grid grid-cols-1 md:grid-cols-[auto,320px]', viewAsCard && 'grid-cols-1 md:grid-cols-1')}>
        <div>
          <div className='grid grid-cols-[max-content,auto] border-b'>
            <div className='border-r p-4'>
              {price && currency
                ? Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(
                    price / 100,
                  )
                : 'Free'}
            </div>
            <div className='p-4 text-muted-foreground'>
              <Link href={`/user/${user.username}`}>{user.name}</Link>
            </div>
          </div>
          {content && <p className='p-4'>{content}</p>}
        </div>
        <div className='border-l space-y-4'>
          <div>
            <h3 className='text-center'>Details</h3>
            <ul className='space-y-2 mt-4 text-sm p-2'>
              {category && (
                <li className='flex justify-between items-center'>
                  <strong>Category</strong> {categories[category]}
                </li>
              )}
              {!viewAsCard &&
                characteristics.map(({ label, value }) => (
                  <li key={`${label}_${value}`} className='flex justify-between items-center'>
                    <strong>{label}</strong> {value}
                  </li>
                ))}
            </ul>
          </div>
          {!viewAsCard && (
            <div className='border-t p-2'>
              <Label>Buyer email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Type your e-mail' />
            </div>
          )}
          <div className='px-2 pb-2'>
            {viewAsCard ? (
              <Button type='button' className='w-full' loading={isSubmitting}>
                <Link href={`/product/${slug}`}>Buy now</Link>
              </Button>
            ) : (
              <Button
                type='button'
                className='w-full'
                loading={isSubmitting}
                onClick={() => onSubmit?.(email)}
                disabled={!email}
              >
                Buy now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
