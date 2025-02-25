'use client'

import { Input } from '@/components/ui/input'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function Filters({ initialValues = {} }: { initialValues?: { category?: string; searchText?: string } }) {
  const { push } = useRouter()
  const { control, handleSubmit, register } = useForm({
    defaultValues: { searchText: '', category: '', ...initialValues },
  })

  const categoriesList = Object.entries(categories)

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
      className='grid grid-cols-[auto,max-content,max-content] items-center gap-2 mx-auto max-w-4xl'
    >
      <Input {...register('searchText')} placeholder='Search product' autoComplete='off' />

      <Controller
        control={control}
        name='category'
        render={({ field }) => {
          return (
            <Select onValueChange={(e) => field.onChange(e)} value={field.value}>
              <SelectTrigger hasValue={Boolean(field.value)} className={cn('max-w-lg w-max')}>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                {categoriesList.map(([key, value]) => {
                  return (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
      />

      <Button>Search</Button>
    </motion.form>
  )
}
