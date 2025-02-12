import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex group relative items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary border-2 border-primary text-primary-foreground hover:bg-primary/90 after:border-primary',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 after:border-destructive border-primary',
        outline: 'border border-primary bg-background hover:bg-accent hover:text-accent-foreground after:border-none',
        secondary:
          'bg-secondary border border-primary text-secondary-foreground hover:bg-secondary/80 after:border-secondary-foreground',
        // ghost: 'hover:bg-accent hover:text-accent-foreground',
        // link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, loading, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          'before:bg-inherit before:w-full before:h-full before:absolute before:bottom-0 before:left-0 before:z-10 before:duration-500 before:border-inherit',
          'after:border after:w-full after:h-full after:absolute after:-right-1.5 after:-bottom-1.5 after:duration-300 after:hover:-translate-x-[5%] after:hover:scale-x-90',
        )}
        type={type}
        ref={ref}
        {...props}
      >
        <div className={cn('relative z-10')}>
          <div className={cn('flex items-center gap-1', loading ? 'opacity-0' : 'opacity-100')}>{children}</div>
          {loading && (
            <div className='absolute left-0 top-0 bg-inherit'>
              <Loader2 size={20} className='animate-spin' />
            </div>
          )}
        </div>
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
