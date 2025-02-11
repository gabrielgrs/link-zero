'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { APP_DESCRIPTION, APP_NAME } from '@/utils/constants/brand'
import { ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'

export default function publicLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <header className='flex justify-between px-4 border-b bg-foreground/5 h-16 items-center'>
        <Logo />
        <nav className='flex items-center gap-4 text-muted-foreground text-sm'>
          <button type='button' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Theme
          </button>
          <Button>
            <Link href='/dashboard' className='flex items-center gap-2 group'>
              Dashboard <ArrowRight size={16} className='duration-500 group-hover:translate-x-2' />
            </Link>
          </Button>
        </nav>
      </header>
      <div className='mx-auto max-w-5xl px-2'>{children}</div>
      <footer className='border-t p-10'>
        <h2>{APP_NAME}</h2>
        <h3>{APP_DESCRIPTION}</h3>
      </footer>
    </div>
  )
}
