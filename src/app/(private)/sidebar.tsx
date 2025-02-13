'use client'

import { Logo } from '@/components/logo'
import { cn } from '@/utils/cn'
import { ChartArea, Library, LogOut, LucideIcon, PackageSearch, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const dynamic = 'force-dynamic'

function NavItem({ icon: Icon, children, href }: { icon: LucideIcon; children: string; href: string }) {
  const pathname = usePathname()

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
