'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { authenticate } from '@/actions/auth'
import { Fieldset } from '@/components/fieldset'
import { Grid } from '@/components/grid'
import { Column } from '@/components/grid/column'
import { Link } from '@/components/link'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { APP_DESCRIPTION, APP_NAME } from '@/utils/constants/brand'
import { requiredField } from '@/utils/messages'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { DotPattern } from './dot-pattern'

export function AuthClient() {
  const { push } = useRouter()
  const form = useForm({ defaultValues: { email: '', code: '', name: '', username: '' } })
  const [isWaitingTheCode, setIsWaitingTheCode] = useState(false)
  const [needRegister, setNeedRegister] = useState(false)

  const action = useServerAction(authenticate, {
    onError: () => {
      toast.error('Failed to sign in')
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
        return push('/dashboard')
      }
    },
  })

  return (
    <div className='min-h-max md:min-h-screen flex flex-col-reverse md:grid grid-cols-2 px-4'>
      <main className='w-full h-full flex flex-col items-center justify-center py-20 md:py-0'>
        <div className='w-full mx-auto max-w-sm'>
          <h1 className='text-center font-semibold text-primary'>Welcome to {APP_NAME}</h1>
          <form onSubmit={form.handleSubmit(action.execute)}>
            <Grid>
              <Column size={12} key={String(`${isWaitingTheCode}_${needRegister}`)}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='flex flex-col gap-2'
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
                      <Input {...form.register('email', { required: requiredField })} placeholder='Type your email' />
                      {needRegister && (
                        <>
                          <Fieldset label='Name' error={form.formState.errors.name?.message}>
                            <Input
                              {...form.register('name', { required: requiredField })}
                              placeholder='Type your name'
                            />
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
              </Column>
              <Column size={12}>
                <Button type='submit' className='w-full' loading={action.isPending}>
                  {isWaitingTheCode && 'Validate code'}
                  {needRegister && !isWaitingTheCode && 'Sign up'}
                  {!isWaitingTheCode && !needRegister && 'Sign in'}
                </Button>
              </Column>
            </Grid>
          </form>
          {/* <div className="flex items-center gap-2 justify-between my-8 opacity-50">
						<span className="w-full h-[1px] bg-foreground" />
						Or
						<span className="w-full h-[1px] bg-foreground" />
					</div>
					<button type="button" className="bg-white text-black w-full rounded-lg h-10">
						Google
					</button> */}
        </div>
      </main>

      <aside className='p-1 md:p-8 h-full w-full'>
        <div
          className='relative w-full rounded-lg h-full bg-primary/10 px-4 py-8 flex flex-col justify-between gap-4'
          style={{
            backgroundImage: 'url(/auth-banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Link
            href='/'
            className='flex items-center gap-2 group bg-primary-foreground p-2 rounded-lg max-w-max backdrop-blur-lg text-primary font-semibold'
          >
            <ArrowLeft className='group-hover:-translate-x-2 duration-500' />
            Back to home
          </Link>
          <div className='p-2 rounded-lg bg-primary-foreground/50 max-w-max backdrop-blur-lg'>
            <p className='max-w-xl text-foreground'>{APP_DESCRIPTION}</p>
          </div>
          <DotPattern className='p-4 rounded opacity-50' />
        </div>
      </aside>
    </div>
  )
}
