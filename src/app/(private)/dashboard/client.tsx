'use client'

import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { useAuth } from '@/hooks/use-auth'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { formatCurrency } from '@/utils/currency'
import { ArrowRight } from 'lucide-react'

function PendingActionCard({ title, description, href }: { title: string; description?: string; href: string }) {
  return (
    <Link href={href} className='flex justify-between items-center bg-accent/10 px-4 py-4 rounded-lg group'>
      <div className='flex flex-col'>
        <p className='font-semibold'>{title}</p>
        <p className='text-muted-foreground font-thin text-xs'>{description}</p>
      </div>
      <ArrowRight size={20} className='duration-500 group-hover:translate-x-2' />
    </Link>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='w-full border bg-foreground/5 p-4 rounded-lg space-y-4'>
      <p className='text-muted-foreground'>{label}</p>
      <p className='text-2xl font-semibold'>{value}</p>
    </div>
  )
}

export function DashboardClient({ sales }: { sales: ProductSchema['sales'] }) {
  const { user } = useAuth()

  const successSales = sales.filter((x) => x.status === 'SUCCESS')
  const pendingSales = sales.filter((x) => x.status === 'PENDING')
  const failedSales = sales.filter((x) => x.status === 'FAILED')

  return (
    <main>
      <Grid>
        <Column size={12}>{user.name ? <h1>Hello, {user.name.split(' ').at(0)}! 👋</h1> : <h1>Hello! 👋</h1>}</Column>

        <Column size={6}>
          <InfoCard
            label='Revenue'
            value={formatCurrency(
              successSales.reduce((acc, curr) => acc + curr.price, 0),
              'USD',
            )}
          />
        </Column>

        <Column size={6}>
          <InfoCard label='Successful sales' value={String(successSales.length)} />
        </Column>

        <Column size={6}>
          <InfoCard label='Pending sales' value={String(pendingSales.length)} />
        </Column>

        <Column size={6}>
          <InfoCard label='Failed sales' value={String(failedSales.length)} />
        </Column>

        {!user.stripeAccountId && <Column size={12}>Pending actions</Column>}
        {!user.stripeAccountId && (
          <>
            <Column size={12}>
              <PendingActionCard
                title='Connect your Stripe account'
                description='Stripe is where you can manage all your payments, receive payments, and more.'
                href='/settings'
              />
            </Column>
          </>
        )}
      </Grid>
    </main>
  )
}
