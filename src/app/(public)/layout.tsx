import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className='flex justify-between px-4 border-foob backdrop-blur-lg z-50 h-16 items-center sticky top-0'>
        <Link href='/'>
          <Logo />
        </Link>
        <nav className='flex gap-1 md:gap-4 items-center text-muted-foreground text-sm h-full'>
          <Link href='/dashboard' className={cn(buttonVariants(), 'group')}>
            Dashboard <ArrowRight size={16} className='duration-500 group-hover:translate-x-2' />
          </Link>
        </nav>
      </header>
      <div className='px-4 mx-auto max-w-7xl py-20'>{children}</div>
    </>
  )
}
