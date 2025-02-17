'use client'

import { cn } from '@/utils/cn'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

export function Top() {
  const pathname = usePathname()

  const title = pathname.slice(1, pathname.length - 1).split('/')

  return (
    <header className='h-20 border-b flex items-center justify-center gap-2 text-sm'>
      {title.map((item, index) => (
        <Fragment key={item}>
          <span className={cn('capitalize text-muted-foreground')}>{item}</span>
          {1 + index < title.length && <ChevronRight size={16} />}
        </Fragment>
      ))}
    </header>
  )
}
