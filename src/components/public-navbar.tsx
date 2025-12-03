'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { cn } from '@/utils/cn'
import { Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ReactNode, useEffect, useState } from 'react'

const navItemClass = 'h-full px-4 md:px-8 hover:bg-primary hover:text-primary-foreground duration-500'

function NavItem({ children, href, className }: { children: ReactNode; href: string; className?: string }) {
  return (
    <Link href={href} className={cn(navItemClass, className)}>
      {children}
    </Link>
  )
}

export function PublicNavbar() {
  const { theme, setTheme } = useTheme()
  const [distanceFromTop, setDistanceFromTop] = useState(0)

  useEffect(() => {
    const handleScroll = () => setDistanceFromTop(window.scrollY)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'flex justify-between gap-1 items-center border-foob backdrop-blur-lg z-50 sticky top-0 bg-background/50 border-b duration-500',
        distanceFromTop < 100 ? 'h-24' : 'h-16',
      )}
    >
      <Link href='/' className='pl-8'>
        <Logo />
      </Link>
      <nav className='flex items-center h-full'>
        <NavItem href='/contact'>Contact</NavItem>
        <NavItem href='/store'>Store</NavItem>
        <NavItem href='/help'>Help</NavItem>
        <button type='button' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={navItemClass}>
          <Sun />
        </button>
        <NavItem href='/auth' className='bg-primary text-primary-foreground'>
          Log in
        </NavItem>
      </nav>
    </header>
  )
}
