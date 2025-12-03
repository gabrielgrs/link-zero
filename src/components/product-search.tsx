'use client'

import { Input } from '@/components/ui/input'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function ProductSearch({ initialValues = {} }: { initialValues?: { searchText?: string } }) {
  const { push } = useRouter()
  const { handleSubmit, register } = useForm({
    defaultValues: { searchText: '', ...initialValues },
  })

  return (
    <motion.form
      layoutId='categories-form'
      onSubmit={handleSubmit((values) => {
        const url = new URL(window.location.href)
        Object.entries(values).forEach(([key, value]) => {
          url.searchParams.set(key, value)
        })

        return push(`/store?${url.searchParams.toString()}`)
      })}
      className='relative'
    >
      <Input
        {...register('searchText')}
        placeholder='Search marketplace'
        autoComplete='off'
        className='pr-14 w-full max-w-7xl h-12'
      />

      <div className='absolute right-0.5 top-0.5'>
        <Button className='h-11 w-12'>
          <Search />
        </Button>
      </div>
    </motion.form>
  )
}
