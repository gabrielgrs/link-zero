'use client'

import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { useAuth } from '@/hooks/use-auth'
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

export function DashboardClient({}) {
  const { user } = useAuth()

  return (
    <main>
      <Grid>
        <Column size={12}>{user.name ? <h1>Hello, {user.name.split(' ').at(0)}! 👋</h1> : <h1>Hello! 👋</h1>}</Column>
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
