import { getAuthenticatedUser } from '@/actions/auth'
import { linkStripeAccountByCode } from '@/actions/stripe'
import { SettingsClient } from './client'

type Props = {
  searchParams: { code?: string }
}

export default async function SettingsPage({ searchParams }: Props) {
  const { code: stripeCode } = await searchParams

  if (stripeCode) {
    const [, err] = await linkStripeAccountByCode({ code: stripeCode })
    throw err
  }

  const [authUser, error] = await getAuthenticatedUser()
  if (error) throw error

  return <SettingsClient user={authUser} />
}
