'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ArrowRight } from 'lucide-react'

export function PublicNavbar() {
  return (
    <header className='flex justify-between px-4 border-foob backdrop-blur-lg z-50 h-16 items-center sticky top-0'>
      <Link href='/'>
        <Logo />
      </Link>
      <nav className='flex gap-1 md:gap-4 items-center text-muted-foreground text-sm h-full'>
        <Link href='/contact' className={cn(buttonVariants({ variant: 'ghost' }))}>
          Contact
        </Link>
        <Link href='/store' className={cn(buttonVariants({ variant: 'ghost' }))}>
          Store
        </Link>
        <Link href='/dashboard' className={cn(buttonVariants(), 'group')}>
          Dashboard <ArrowRight size={16} className='duration-500 group-hover:translate-x-2' />
        </Link>
      </nav>
    </header>
  )
}
