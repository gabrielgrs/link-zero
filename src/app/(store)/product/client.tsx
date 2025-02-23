'use client'

import { getProductBySlug } from '@/actions/product'
import { createCheckout } from '@/actions/stripe'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Product } from '@/components/product'
import { useAuth } from '@/hooks/use-auth'
import { ServerActionResponse } from '@/utils/action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

type Props = {
  product: ServerActionResponse<typeof getProductBySlug>
  isPreview?: boolean
}

export function ProductClient({ product, isPreview = false }: Props) {
  const { push } = useRouter()
  const { user } = useAuth()
  const action = useServerAction(createCheckout, {
    onSuccess: ({ data }) => {
      toast.success('We are redirecting you to the payment...')
      return push(data.url)
    },
    onError: (error) => {
      toast.error(error.err.message || 'Failed. Try again later.')
    },
  })

  return (
    <div>
      <main className='mx-auto max-w-5xl p-8'>
        <Product
          {...product}
          isSubmitting={action.isPending || action.isSuccess}
          onSubmit={() => {
            if (user) return action.execute({ email: user.email, productId: product._id })
            return push(`/auth?redirectTo=/product/${product.slug}`)
          }}
          isPreview={isPreview}
        />
      </main>
      <footer className='flex justify-center items-center gap-2 text-muted-foreground py-4'>
        Powered by{' '}
        <Link href='/'>
          <Logo />
        </Link>
      </footer>
    </div>
  )
}
