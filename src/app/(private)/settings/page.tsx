import { getAuthenticatedUser } from '@/actions/auth'
import { SettingsClient } from './client'

export default async function SettingsPage() {
  const [authUser, error] = await getAuthenticatedUser()
  if (error) throw error

  return <SettingsClient user={authUser} />
}
