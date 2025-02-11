import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <main>
      <Grid>
        <Column size={12} className='flex justify-between items-center gap-2'>
          <h1>Products</h1>
          <Link href='/products/form'>
            <Button>New product</Button>
          </Link>
        </Column>
      </Grid>
    </main>
  )
}
