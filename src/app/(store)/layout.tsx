import { PublicNavbar } from '@/components/public-navbar'
import { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <div className='px-4 mx-auto max-w-7xl py-20'>{children}</div>
    </>
  )
}
