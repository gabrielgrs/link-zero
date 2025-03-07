import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from './confetti'

type Props = {
  searchParams: Promise<{ type: 'success' | 'failure' }>
}
export default async function Subscription({ searchParams }: Props) {
  const { type } = await searchParams

  return (
    <main>
      {type === 'success' && <Confetti />}
      <Grid>
        <Column size={12}>
          <h1>Subscription</h1>
        </Column>
        <Column size={12}>
          <p className='text-muted-foreground'>
            {type === 'success' ? 'Subscription successful' : 'Subscription failed'}
          </p>
        </Column>
        {type === 'success' && (
          <Column size={12}>
            <Link href='/library' className='underline underline-offset-4 flex items-center gap-1'>
              <ArrowLeft size={16} />
              Check my product
            </Link>
          </Column>
        )}
      </Grid>
    </main>
  )
}
