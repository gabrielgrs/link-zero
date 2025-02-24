'use client'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { ChevronLeft, MessageCircle } from 'lucide-react'

export default function NotFound() {
  const { user } = useAuth()

  return (
    <div className='min-h-[calc(100vh-300px)] flex items-center justify-center'>
      <span className='text-foreground/5 opacity-50 pointer-events-none text-9xl md:text-[400px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]'>
        404
      </span>
      <div className='space-y-8'>
        <h1 className='text-center'>Not found</h1>
        <div className='flex items-center justify-center gap-4'>
          <Link href={user ? '/dashboard' : '/'} className={buttonVariants()}>
            <ChevronLeft size={16} />
            Back page
          </Link>
          <Link href='/contact' className={buttonVariants({ variant: 'ghost' })}>
            Contact
            <MessageCircle size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
