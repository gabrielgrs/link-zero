'use client'

import { useAuth } from '@/hooks/use-auth'

export default function Page() {
  const { user } = useAuth()
  return <main>{user.name ? <h1>Hello, {user.name.split(' ').at(0)}! 👋</h1> : <h1>Hello! 👋</h1>}</main>
}
