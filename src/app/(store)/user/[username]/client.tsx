import { getUserByUsername } from '@/actions/auth'
import { getProductsByUser } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Product } from '@/components/product'
import { ServerActionResponse } from '@/utils/action'

type Props = {
  user: ServerActionResponse<typeof getUserByUsername>
  products: ServerActionResponse<typeof getProductsByUser>
}

export function UserClient({ user, products }: Props) {
  return (
    <div>
      <header className='flex border-b items-center justify-between px-8 h-16 sticky-top'>
        <Link href='/'>
          <Logo />
        </Link>
        <p>{user.name}</p>
      </header>
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
                {products.map((product) => (
                  <Product key={product._id} {...product} user={user} viewAsCard />
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
