'use client'

import { getUserByUsername, updateUser } from '@/actions/auth'
import { linkAccount } from '@/actions/stripe'
import { Fieldset } from '@/components/fieldset'
import { Column, Grid } from '@/components/grid'
import { Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ServerActionResponse } from '@/utils/action'
import { displayErrors } from '@/utils/action/client'
import { requiredField } from '@/utils/messages'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

export function SettingsClient({ user }: { user: ServerActionResponse<typeof getUserByUsername> }) {
  const { register, handleSubmit, formState, reset } = useForm({ defaultValues: user })
  const { push } = useRouter()

  const linkAccountAction = useServerAction(linkAccount, {
    onSuccess: ({ data }) => {
      push(data.url)
    },
  })

  const updateUserAction = useServerAction(updateUser, {
    onSuccess: () => {
      toast.success('Profile updated')
    },
    onError: (error) => displayErrors(error),
  })

  return (
    <main className='space-y-4'>
      <form
        onSubmit={handleSubmit((values) =>
          updateUserAction.execute({
            bio: values.bio!,
            name: values.name!,
            username: values.username,
          }),
        )}
      >
        <Grid>
          <Column size={12}>
            <Title>Settings</Title>
          </Column>

          <Column size={6}>
            <Fieldset label='Email' error={formState.errors.email?.message}>
              <Input {...register('email', { required: requiredField })} disabled />
            </Fieldset>
          </Column>

          <Column size={6}>{null}</Column>

          <Column size={6}>
            <Fieldset label='Name' error={formState.errors.email?.message}>
              <Input {...register('name', { required: requiredField })} placeholder='Type your name' />
            </Fieldset>
          </Column>

          <Column size={6}>
            <Fieldset label='Username' error={formState.errors.email?.message}>
              <Input {...register('username', { required: requiredField })} placeholder='Type your name' />
            </Fieldset>
          </Column>

          <Column size={12}>
            <Fieldset label='Bio' error={formState.errors.email?.message}>
              <Textarea {...register('bio')} placeholder='Type your name' />
            </Fieldset>
          </Column>

          <Column size={12} className='flex justify-end items-center gap-2'>
            <Button type='button' onClick={() => reset(user)} variant='outline'>
              Reset
            </Button>
            <Button type='submit'>Update</Button>
          </Column>
        </Grid>
      </form>

      {!user.stripeAccountId && (
        <Column size={12}>
          <Button
            onClick={() => linkAccountAction.execute()}
            loading={linkAccountAction.isPending || linkAccountAction.isSuccess}
          >
            Connect your account to Stripe to start receiving payments
          </Button>
        </Column>
      )}
    </main>
  )
}
