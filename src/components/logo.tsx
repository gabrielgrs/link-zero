import { cn } from '@/utils/cn'
import { APP_NAME } from '@/utils/constants/brand'

export function Logo({ className }: { className?: string }) {
  return <div className={cn('text-lg font-bol text-foreground', className)}>{APP_NAME}</div>
}
