'use client'

import { linkAccount } from '@/actions/stripe'
import { Column, Grid } from '@/components/grid'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useServerAction } from 'zsa-react'

export function DashboardClient({}) {
  const { user } = useAuth()
  const { push } = useRouter()

  const linkAccountAction = useServerAction(linkAccount, {
    onSuccess: ({ data }) => {
      push(data.url)
    },
  })

  return (
    <main>
      <Grid>
        <Column size={12}>{user.name ? <h1>Hello, {user.name.split(' ').at(0)}! 👋</h1> : <h1>Hello! 👋</h1>}</Column>
        {!user.stripeAccountId && (
          <Column size={12}>
            <h2>Connect your account to Stripe to start receiving payments</h2>
            <p>Let your supporters pay using credit or debit cards, Apple Pay, Google Pay and more!</p>
            <Button
              onClick={() => linkAccountAction.execute()}
              loading={linkAccountAction.isPending || linkAccountAction.isSuccess}
            >
              Connect your Stripe account
            </Button>
          </Column>
        )}
      </Grid>
    </main>
  )
}
