'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/cn'
import { ArrowRight, Menu } from 'lucide-react'

function NavItems() {
  return (
    <>
      <Link href='/contact' className={cn(buttonVariants({ variant: 'ghost' }))}>
        Contact
      </Link>
      <Link href='/store' className={cn(buttonVariants({ variant: 'ghost' }))}>
        Store
      </Link>
      <Link href='/help' className={cn(buttonVariants({ variant: 'ghost' }))}>
        Help
      </Link>
    </>
  )
}

export function PublicNavbar() {
  return (
    <header className='flex justify-between px-4 border-foob backdrop-blur-lg z-50 h-16 items-center sticky top-0'>
      <Link href='/'>
        <Logo />
      </Link>
      <nav className='flex gap-4 items-center text-muted-foreground text-sm h-full'>
        <div className='items-center gap-4 hidden sm:flex'>
          <NavItems />
        </div>
        <Link href='/dashboard' className={cn(buttonVariants(), 'group')}>
          Dashboard <ArrowRight size={16} className='duration-500 group-hover:translate-x-2' />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex sm:hidden'>
              <Menu />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <NavItems />
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
