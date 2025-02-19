'use client'

import { authenticate } from '@/actions/auth'
import { Fieldset } from '@/components/fieldset'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { APP_DESCRIPTION, APP_NAME } from '@/utils/constants/brand'
import { requiredField } from '@/utils/messages'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { GoogleButton } from './google-button'

type Props = {
  redirectTo?: string
}

export function AuthClient({ redirectTo }: Props) {
  const { push } = useRouter()
  const form = useForm({ defaultValues: { email: '', code: '', name: '', username: '' } })
  const [isWaitingTheCode, setIsWaitingTheCode] = useState(false)
  const [needRegister, setNeedRegister] = useState(false)

  const action = useServerAction(authenticate, {
    onError: (error) => {
      toast.error(error.err.message || 'Failed. Try again later.')
    },
    onSuccess: ({ data }) => {
      if (data.status === 'SHOULD_REGISTER') {
        toast.info('Finish your register')
        return setNeedRegister(true)
      }
      if (data.status === 'WAITING_FOR_CODE') {
        toast.info('Check your email for the code')
        return setIsWaitingTheCode(true)
      }
      if (data.status === 'AUTHORIZED') {
        toast.success('Signed in with success! Redirecting you...')
        return push(redirectTo || '/dashboard')
      }
    },
  })

  return (
    <div className='grid grid-rows-[max-content,auto,max-content] gap-4 min-h-screen px-4'>
      <header className='flex justify-between p-4 sticky top-0'>
        <Link href='/' className={buttonVariants({ variant: 'outline' })}>
          <ChevronLeft size={16} />
          Back to home
        </Link>
        <Logo />
      </header>
      <form
        onSubmit={form.handleSubmit(action.execute)}
        className='w-full h-full flex flex-col items-center justify-start md:justify-center py-20 md:py-0'
      >
        <main className='space-y-4'>
          <div>
            <h1 className='text-center font-semibold text-primary'>Welcome to {APP_NAME}</h1>
            <p className='text-muted-foreground text-center'>{APP_DESCRIPTION}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex flex-col gap-2'
            key={String(`${isWaitingTheCode}_${needRegister}`)}
          >
            {isWaitingTheCode ? (
              <Controller
                control={form.control}
                name='code'
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    containerClassName='flex justify-between w-full'
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            ) : (
              <>
                <Fieldset label='Email' error={form.formState.errors.email?.message}>
                  <Input {...form.register('email', { required: requiredField })} placeholder='Type your email' />
                </Fieldset>
                {needRegister && (
                  <>
                    <Fieldset label='Name' error={form.formState.errors.name?.message}>
                      <Input {...form.register('name', { required: requiredField })} placeholder='Type your name' />
                    </Fieldset>

                    <Fieldset
                      label='Username'
                      error={form.formState.errors.name?.message}
                      info='Only lowercase letters, minus and numbers'
                    >
                      <Controller
                        name='username'
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <Input
                              value={field.value}
                              onChange={(event) =>
                                field.onChange(
                                  slugify(event.target.value, {
                                    lower: true,
                                    strict: true,
                                    replacement: '-',
                                    trim: false,
                                  }),
                                )
                              }
                              placeholder='Type your name'
                            />
                          )
                        }}
                      />
                    </Fieldset>
                  </>
                )}
              </>
            )}
          </motion.div>

          <Button type='submit' className='w-full' loading={action.isPending}>
            {isWaitingTheCode && 'Validate code'}
            {needRegister && !isWaitingTheCode && 'Sign up'}
            {!isWaitingTheCode && !needRegister && 'Sign in'}
          </Button>

          {process.env.GOOGLE_CLIENT_SECRET && (
            <>
              <div className='flex items-center justify-center gap-2 relative'>
                <div className='w-full h-[1px] bg-foreground/20' />
                <span className='relative z-10 px-2'>Or</span>
                <div className='w-full h-[1px] bg-foreground/20' />
              </div>

              <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_SECRET}>
                <GoogleButton />
              </GoogleOAuthProvider>
            </>
          )}
        </main>
      </form>

      <footer className='p-4 text-center flex items-center justify-center gap-2 text-muted-foreground'>
        Made by <Logo className='text-base underline underline-offset-4' />
      </footer>
    </div>
  )
}
