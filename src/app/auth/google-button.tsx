'use client'

import { signInWithGoogle } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { GoogleLogin } from '@react-oauth/google'
import {} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

export function GoogleButton() {
  const { push } = useRouter()

  const googleAuthAction = useServerAction(signInWithGoogle, {
    onSuccess: () => {
      push('/dashboard')
    },
  })

  if (googleAuthAction.isPending || googleAuthAction.isSuccess) {
    return (
      <Button variant='secondary' type='button' className='w-full' loading>
        {null}
      </Button>
    )
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        googleAuthAction.execute({ googleJWT: credentialResponse.credential! })
        toast.success('Signed in with success! Redirecting you...')
      }}
      onError={() => {
        toast.error('Login Failed')
      }}
    />
  )
}
