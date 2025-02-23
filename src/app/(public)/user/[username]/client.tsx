import { getUserByUsername } from '@/actions/auth'
import { getProductsByUser } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { ProductCard } from '@/components/product-card'
import { ServerActionResponse } from '@/utils/action'

type Props = {
  user: ServerActionResponse<typeof getUserByUsername>
  products: ServerActionResponse<typeof getProductsByUser>
}

export function UserClient({ user, products }: Props) {
  return (
    <div>
      <h1 className='text-muted-foreground text-center'>{user.name}'s profile</h1>
      <main>
        <Grid>
          {user.bio && (
            <Column size={12} className='border-b px-4 py-8'>
              {user.bio}
            </Column>
          )}
          <Column size={12} className='border-b px-4 py-8'>
            <section>
              <h1>Created products</h1>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      _id: product._id,
                      currency: product.currency,
                      cover: product.cover,
                      price: product.price,
                      name: product.name,
                      slug: product.slug,
                    }}
                    user={{ username: user.username, name: user.name! }}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </Column>
        </Grid>
      </main>
      <footer className='flex justify-center items-center gap-2 text-muted-foreground py-4'>
        Powered by{' '}
        <Link href='/'>
          <Logo />
        </Link>
      </footer>
    </div>
  )
}
