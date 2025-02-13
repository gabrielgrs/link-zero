import { getAuthenticatedUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { AuthClient } from './client'

export default async function Page() {
  const [authUser] = await getAuthenticatedUser()

  if (Boolean(authUser)) return redirect('/dashboard')
  return <AuthClient />
}
