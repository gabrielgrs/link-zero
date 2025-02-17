import { cn } from '@/utils/cn'
import { APP_NAME, SHORT_APP_NAME } from '@/utils/constants/brand'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('text-lg font-bol text-foreground', className)}>
      <span className='hidden md:inline'>{APP_NAME}</span>
      <span className='md:hidden'>{SHORT_APP_NAME}</span>
    </div>
  )
}
