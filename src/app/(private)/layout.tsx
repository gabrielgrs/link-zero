import { getAuthenticatedUser } from '@/actions/auth'
import { FadeInLayout } from '@/components/fade-in-layout'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Top } from './top'

export const dynamic = 'force-dynamic'

const queryClient = new QueryClient()

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const [, error] = await getAuthenticatedUser()
  if (error) return redirect('/auth')

  await queryClient.prefetchQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const [data, err] = await getAuthenticatedUser()
      if (err) throw err
      return data
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='grid grid-cols-[60px,auto] md:grid-cols-[240px,auto]'>
        <Sidebar />
        <div>
          <Top />
          <div className='p-8 mx-auto max-w-7xl'>
            <FadeInLayout>{children}</FadeInLayout>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}
