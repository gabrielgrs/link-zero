import { cn } from '@/utils/cn'
import { ComponentProps, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'> & { format?: (value: string) => string }>(
  ({ className, type, onChange, format, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        onChange={(e) => {
          if (format) {
            e.target.value = format(e.target.value)
          }
          onChange?.(e)
        }}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
