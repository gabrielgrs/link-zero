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
}

export function ProductClient({ product }: Props) {
  const { push } = useRouter()
  const { user } = useAuth()
  const action = useServerAction(createCheckout, {
    onSuccess: ({ data }) => {
      toast.success('We are redirecting you to the payment...')
      return push(data.url)
    },
    onError: (err) => {
      console.error(err.err)
      toast.error('Failed. Try again later.')
    },
  })

  return (
    <div>
      <main className='mx-auto max-w-5xl p-8'>
        <Product
          {...product}
          isSubmitting={action.isPending || action.isSuccess}
          initialEmail={user?.email}
          onSubmit={() => action.execute({ email: 'grxgabriel@gmail.com', productId: product._id })}
        />
      </main>
      <footer className='flex justify-center items-center gap-2 text-muted-foreground'>
        Powered by{' '}
        <Link href='/'>
          <Logo />
        </Link>
      </footer>
    </div>
  )
}
