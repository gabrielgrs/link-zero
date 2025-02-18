'use client'

import { getUserByUsername, updateUser } from '@/actions/auth'
import { Fieldset } from '@/components/fieldset'
import { Column, Grid } from '@/components/grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ServerActionResponse } from '@/utils/action'
import { requiredField } from '@/utils/messages'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

export function SettingsClient({ user }: { user: ServerActionResponse<typeof getUserByUsername> }) {
  const { register, handleSubmit, formState, reset } = useForm({ defaultValues: user })

  const updateUserAction = useServerAction(updateUser, {
    onSuccess: () => {
      toast.success('Profile updated')
    },
    onError: (error) => {
      toast.error(error.err.message || 'Failed. Try again later.')
    },
  })

  return (
    <main>
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
            <h1>Settings</h1>
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
    </main>
  )
}
