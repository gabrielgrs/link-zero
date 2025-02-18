'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { cn } from '@/utils/cn'
import { ChartArea, Library, LogOut, LucideIcon, Moon, PackageSearch, Settings, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

function NavItem({
  icon: Icon,
  children,
  href,
  onClick,
}: { icon: LucideIcon; children: ReactNode; href?: string; onClick?: () => void }) {
  const pathname = usePathname()

  if (!href && !onClick) throw new Error('href or onClick is required')

  if (!href) {
    return (
      <button
        onClick={onClick}
        type='button'
        className={cn(
          'border-b h-14 w-full flex items-center justify-center md:justify-start gap-2 px-4 hover:bg-foreground/10 duration-500 text-muted-foreground',
        )}
      >
        <Icon />
        <span className='hidden md:inline'>{children}</span>
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'border-b h-14 w-full flex items-center justify-center md:justify-start gap-2 px-4 hover:bg-foreground/10 duration-500 text-muted-foreground',
        pathname.includes(href) && 'text-primary',
      )}
    >
      <Icon />
      <span className='hidden md:inline'>{children}</span>
    </Link>
  )
}

export function Sidebar() {
  const { theme, setTheme } = useTheme()

  return (
    <aside className='h-screen border-r sticky top-0'>
      <div className='flex flex-col'>
        <Link href='/' className='h-20 border-b w-full flex items-center justify-center text-center'>
          <Logo />
        </Link>
        <nav>
          <NavItem href='/dashboard' icon={ChartArea}>
            Dashboard
          </NavItem>

          <NavItem href='/products' icon={PackageSearch}>
            Products
          </NavItem>

          <NavItem href='/library' icon={Library}>
            Library
          </NavItem>

          <NavItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} icon={theme === 'dark' ? Sun : Moon}>
            {theme === 'dark' ? 'Light' : 'Dark'} theme
          </NavItem>

          <NavItem href='/settings' icon={Settings}>
            Settings
          </NavItem>

          <NavItem href='/logout' icon={LogOut}>
            Logout
          </NavItem>
        </nav>
      </div>
    </aside>
  )
}
