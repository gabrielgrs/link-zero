'use client'

import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { APP_NAME } from '@/utils/constants/brand'
import { formatCurrency } from '@/utils/currency'
import { Copy, Dot, Facebook, Flame, Twitter } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Link } from './link'
import { Button } from './ui/button'
import { Label } from './ui/label'

type Props = Omit<
  ProductSchema,
  '_id' | 'user' | 'active' | 'content' | 'stripePriceId' | 'stripeProductId' | 'createdAt' | 'updatedAt'
> & {
  user: UserSchema
  onSubmit?: () => void
  isSubmitting?: boolean
  className?: string
  isPreview?: boolean
}

export function Product({
  name,
  cover,
  price,
  user,
  description,
  category,
  currency,
  onSubmit,
  isSubmitting,
  isPreview = false,
  sales,
}: Props) {
  const copyToClipboard = () => {
    toast.promise(navigator.clipboard.writeText(window.location.href), {
      loading: 'Copying...',
      success: 'Text copied successfully!',
      error: 'Failed to copy text.',
    })
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='space-y-8'>
        {cover && (
          <div className={cn('relative h-[240px] bg-foreground/5 w-full')}>
            <Image
              src={cover}
              alt={name}
              fill
              className='rounded-lg'
              style={{ objectFit: 'cover', objectPosition: 'center', backgroundSize: '100%' }}
            />
          </div>
        )}
        <div>
          <Label>Description</Label>
          <p
            className='text-muted-foreground'
            dangerouslySetInnerHTML={{ __html: description || 'No description yet' }}
          ></p>
        </div>
      </div>
      <div className='space-y-4'>
        <div>
          <h1 className='text-2xl font-semibold'>{name}</h1>
          <Link
            href={`/user/${user.username}`}
            className='duration-500 text-sm text-muted-foreground hover:text-accent flex items-center gap-[-4px]'
          >
            @{user.username} <Dot /> <span className='underline underline-offset-4'>View profile</span>
          </Link>
        </div>

        <div>
          <Label>Category</Label>
          <br />
          <p className='text-muted-foreground'>{categories[category]}</p>
        </div>

        <div className='sticky bottom-4 backdrop-blur-lg'>
          <Button type='button' className='w-full' disabled={isPreview} loading={isSubmitting} onClick={onSubmit}>
            Get it now for just {formatCurrency(price, currency)}!
          </Button>
        </div>

        <div>
          {sales.length > 1 && (
            <p className='text-muted-foreground flex items-center gap-1 font-bold'>
              <Flame size={20} className='text-red-500 fill-red-500' /> {sales.length} sold
            </p>
          )}
        </div>
        <div>
          <Label>Share this content</Label>
          <div className='flex items-center gap-1'>
            <Button type='button' variant='outline' onClick={() => copyToClipboard()}>
              Copy <Copy size={16} />
            </Button>

            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => {
                const url = new URL('https://twitter.com/intent/tweet')
                url.searchParams.append('text', `Check out this product ${name} on ${APP_NAME}`)
                url.searchParams.append('url', window.location.href)
                window.open(url.toString(), '_blank')
              }}
            >
              <Twitter />
            </Button>

            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() =>
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')
              }
            >
              <Facebook />
            </Button>
          </div>
        </div>
      </div>
    </div>
    // <div className={cn('border shadow', className)}>
    //   <div
    //     className={cn('h-40 bg-foreground/5 w-full')}
    //     style={{
    //       backgroundImage: `url(${cover})`,
    //       objectFit: 'cover',
    //       objectPosition: 'center',
    //       backgroundSize: '100%',
    //     }}
    //   />
    //   <div className={cn('h-20 flex items-center pl-8 border', 'pl-0 justify-center')}>
    //     <h1>{name}</h1>
    //   </div>
    //   <div className={cn('grid grid-cols-1 md:grid-cols-[auto,320px]')}>
    //     <div>
    //       <div className='grid grid-cols-[max-content,auto] border-b'>
    //         <div className='border-r p-4'>
    //           {price && currency
    //             ? Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(
    //                 price / 100,
    //               )
    //             : 'Free'}
    //         </div>
    //         <div className='p-4 text-muted-foreground'>
    //           <Link href={`/user/${user.username}`}>{user.name}</Link>
    //         </div>
    //       </div>
    //       {description && <p className='p-4'>{description}</p>}
    //     </div>
    //     <div className='border-l space-y-4 py-2'>
    //       <div>
    //         {category && (
    //           <p className='flex p-2 text-sm justify-between items-center'>
    //             <strong>Category</strong> {categories[category]}
    //           </p>
    //         )}
    //       </div>

    //       <div className='px-2'>
    //         <Button type='button' className='w-full' disabled={isPreview} loading={isSubmitting} onClick={onSubmit}>
    //           Buy now for just {formatCurrency(price, currency)}
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
