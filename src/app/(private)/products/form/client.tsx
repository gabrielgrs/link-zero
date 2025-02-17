'use client'

import { createProduct, updateProduct } from '@/actions/product'
import { Fieldset } from '@/components/fieldset'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Product } from '@/components/product'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { mimeTypes } from '@/libs/mongoose/schemas/product'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { Currency, currencies } from '@/utils/constants/currencies'
import { requiredField } from '@/utils/messages'
import { ChevronDown, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

const defaultValues = {
  _id: '',
  name: '',
  cover: '' as string | undefined,
  description: '',
  price: 0,
  category: '',
  currency: Object.values(currencies)[0] as Currency,
  details: [] as { label: string; value: string }[],
  slug: '',
  url: '',
  file: '',
}

export function ProductForm({ initialValues }: { initialValues?: typeof defaultValues }) {
  const isEdition = Boolean(initialValues?._id)
  const { push } = useRouter()
  const { control, register, formState, handleSubmit } = useForm({
    defaultValues: initialValues ? { ...defaultValues, ...initialValues } : defaultValues,
  })
  const name = useWatch({ control, name: 'name' })
  const price = useWatch({ control, name: 'price' })
  const currency = useWatch({ control, name: 'currency' })
  const cover = useWatch({ control, name: 'cover' })
  const category = useWatch({ control, name: 'category' })
  const description = useWatch({ control, name: 'description' })
  const slug = useWatch({ control, name: 'slug' })
  const details = useWatch({ control, name: 'details' })
  const detailsFieldArray = useFieldArray({ control, name: 'details' })

  const { user } = useAuth()

  const action = useServerAction(isEdition ? updateProduct : createProduct, {
    onSuccess: () => {
      toast.success('Success!')
      push('/products')
    },
    onError: (error) => {
      toast.error(error.err.message || 'Failed. Try again later.')
    },
  })

  return (
    <main>
      <form onSubmit={handleSubmit((values) => action.execute(values))}>
        <Grid>
          <Column size={12}>
            <h1>{isEdition ? 'Edit' : 'Publish a new'} product</h1>
          </Column>

          {!isEdition && (
            <>
              <Column size={12} className='px-8'>
                <p className={cn('text-xs text-muted-foreground')}>
                  Aceppted formats:{' '}
                  {Object.values(mimeTypes)
                    .map((item) => item.split('/')[1])
                    .join(', ')}
                </p>
              </Column>

              <Column size={12}>
                <Fieldset label='Content' error={formState.errors.file?.message} info='Max of 5mb'>
                  <Controller
                    control={control}
                    name='file'
                    render={({ field }) => {
                      return (
                        <Input
                          {...register('file', { required: requiredField })}
                          type='file'
                          value={field.value}
                          accept={Object.values(mimeTypes).join(', ')}
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file && file.size > 5 * 1024 * 1024) {
                              return toast.error('File size must be less than 5mb.')
                            }

                            field.onChange(event)
                          }}
                        />
                      )
                    }}
                  />
                </Fieldset>
              </Column>
            </>
          )}

          {isEdition && initialValues?.url && (
            <Column size={12}>
              <Label>Content</Label>
              <br />
              <Link href={initialValues.url} target='_blank' className='text-sm text-muted-foreground'>
                {initialValues?.url}
              </Link>
            </Column>
          )}

          <Column size={4}>
            <Fieldset label='Category' error={formState.errors.category?.message}>
              <Controller
                control={control}
                name='category'
                render={({ field }) => {
                  return (
                    <Select onValueChange={(e) => field.onChange(e)} value={field.value}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categories).map(([key, value]) => {
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
            </Fieldset>
          </Column>

          <Column size={8}>
            <Fieldset label='Cover URL' error={formState.errors.cover?.message}>
              <Input {...register('cover')} placeholder='Product Cover' />
            </Fieldset>
          </Column>

          <Column size={4}>
            <Fieldset
              label='Slug'
              error={formState.errors.name?.message}
              info='Only lowercase letters, minus and numbers'
            >
              <Controller
                name='slug'
                control={control}
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
          </Column>

          <Column size={5}>
            <Fieldset label='Name' error={formState.errors.name?.message}>
              <Input {...register('name', { required: requiredField })} placeholder='Type the product name' />
            </Fieldset>
          </Column>

          <Column size={3}>
            <Fieldset label='Product price' error={formState.errors.price?.message}>
              <div className={cn('relative', isEdition && 'opacity-50 cursor-not-allowed pointer-events-none')}>
                <Controller
                  control={control}
                  name='currency'
                  render={({ field }) => {
                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className='absolute text-xs left-1 bg-foreground/10 h-8 w-12 flex gap-1 items-center justify-center top-[50%] translate-y-[-50%]'>
                            {currency.toUpperCase()}
                            <ChevronDown size={12} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Object.entries(currencies).map(([key, value]) => {
                            return (
                              <DropdownMenuItem key={key} onClick={() => field.onChange(value)}>
                                {value.toUpperCase()}
                              </DropdownMenuItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  }}
                />
                <Input
                  {...register('price', { required: requiredField })}
                  placeholder='Type the product price'
                  className='pl-16'
                />
              </div>
            </Fieldset>
          </Column>

          <Column size={12}>
            <Fieldset label='Description' error={formState.errors.description?.message}>
              <Textarea {...register('description', { required: requiredField })} placeholder='Describe the product' />
            </Fieldset>
          </Column>

          <Column size={12}>
            <Grid>
              <Column size={12}>
                <Label>Characteristics</Label>
              </Column>

              {detailsFieldArray.fields.map((f, index) => (
                <Fragment key={f.id}>
                  <Column size={2} className='flex items-center text-sm'>
                    #{index + 1} Characteristic
                  </Column>
                  <Column size={4}>
                    <Input {...register(`details.${index}.label`, { required: requiredField })} placeholder='Label' />
                  </Column>
                  <Column size={4}>
                    <Input {...register(`details.${index}.value`, { required: requiredField })} placeholder='value' />
                  </Column>
                  <Column size={1}>
                    <Button type='button' variant='destructive' onClick={() => detailsFieldArray.remove(index)}>
                      <Trash />
                    </Button>
                  </Column>
                </Fragment>
              ))}
              <Column size={12} className='flex justify-center'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => detailsFieldArray.append({ label: '', value: '' })}
                >
                  Add detail
                </Button>
              </Column>
            </Grid>
          </Column>

          <Column size={12} className='mt-10'>
            <h2>Preview</h2>
          </Column>

          <Column size={12}>
            <Product
              name={name}
              currency={currency as Currency}
              price={price}
              cover={cover}
              user={user}
              description={description}
              details={details}
              category={category as keyof typeof categories}
              slug={slug}
            />
          </Column>

          <Column
            size={12}
            className='flex justify-end gap-2 items-center sticky bottom-2 backdrop-blur-sm z-20 py-4 my-8'
          >
            <Button type='reset' variant='outline'>
              Cancel
            </Button>

            <Button type='submit' loading={action.isPending || action.isSuccess}>
              Save product
            </Button>
          </Column>
        </Grid>
      </form>
    </main>
  )
}
