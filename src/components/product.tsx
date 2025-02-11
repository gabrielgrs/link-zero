import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { UserSchema } from '@/libs/mongoose/schemas/user'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { Link } from './link'
import { Button } from './ui/button'

export function Product({
  name,
  cover,
  price,
  user,
  content,
  characteristics,
  category,
  viewAsCard = false,
}: Omit<ProductSchema, '_id' | 'user' | 'createdAt' | 'updatedAt'> & { user: UserSchema; viewAsCard?: boolean }) {
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
      <div className={cn('grid grid-cols-[auto,320px]', viewAsCard && 'grid-cols-1')}>
        <div>
          <div className='grid grid-cols-[max-content,auto] border-b'>
            <div className='border-r p-4'>
              {price ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 100) : 'Free'}
            </div>
            <div className='p-4 text-muted-foreground'>
              <Link href={`/user/${user.username}`}>{user.name}</Link>
            </div>
          </div>
          {content && <p className='p-4'>{content}</p>}
        </div>
        <div className='border-l p-2 space-y-4'>
          <div>
            <h3 className='text-center'>Details</h3>
            <ul className='space-y-2 mt-4 text-sm'>
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
          <Button type='button' className='w-full'>
            Buy now
          </Button>
        </div>
      </div>
    </div>
  )
}
