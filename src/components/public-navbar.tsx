'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/cn'
import { Menu } from 'lucide-react'

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
    <header className='grid gap-1 shadow grid-cols-[auto,max-content,max-content] md:grid-cols-[180px,auto,180px] items-center px-4 border-foob backdrop-blur-lg z-50 h-16 sticky top-0 bg-background border-b'>
      <Link href='/'>
        <Logo />
      </Link>
      <nav className='items-center justify-center hidden md:flex'>
        <NavItems />
      </nav>
      <div className='flex items-center gap-1'>
        <Link href='/auth' className={cn(buttonVariants({ variant: 'ghost' }), 'group')}>
          Log in
        </Link>
        <Link href='/auth' className={cn(buttonVariants({ variant: 'accent' }), 'group')}>
          Sign up
        </Link>
      </div>
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
    </header>
  )
}
