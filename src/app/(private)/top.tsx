'use client'

import { usePathname } from 'next/navigation'

export function Top() {
  const pathname = usePathname()

  const title = pathname.split('/').pop()

  return <header className='h-20 border-b flex items-center justify-center'>{title}</header>
}
