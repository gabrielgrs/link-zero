'use client'

import { createProduct, generateDownloadUrl, updateProduct } from '@/actions/product'
import { Fieldset } from '@/components/fieldset'
import { Column, Grid } from '@/components/grid'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { mimeTypes } from '@/libs/mongoose/schemas/product'
import { displayErrors } from '@/utils/action/client'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { Currency, currencies } from '@/utils/constants/currencies'
import { MAX_PRODUCT_PRICE, MIN_PRODUCT_PRICE } from '@/utils/constants/pricing'
import { formatCurrency } from '@/utils/currency'
import { goToPreview } from '@/utils/fn'
import { invalidValue, requiredField } from '@/utils/messages'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { FileUpload } from './file-upload'

function numberToCurrencyCents(value: number) {
  const asString = String(value.toFixed(2))
  const [integer, decimal] = asString.split('.')
  return 100 * Number(integer) + Number(decimal)
}
const defaultValues = {
  _id: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  currency: Object.values(currencies)[0] as Currency,
  slug: '',
  cover: '' as string | File,
  file: '' as string | File,
}

export function ProductForm({ initialValues }: { storageKey?: string; initialValues?: typeof defaultValues }) {
  const isEdition = Boolean(initialValues?._id)
  const { push } = useRouter()
  const { control, register, formState, handleSubmit, getValues } = useForm({
    defaultValues: initialValues ? { ...defaultValues, ...initialValues } : defaultValues,
  })

  const action = useServerAction(isEdition ? updateProduct : createProduct, {
    onSuccess: () => {
      toast.success('Success!')
      push('/products')
    },
    onError: (error) => displayErrors(error),
  })

  const generateDownloadUrlAction = useServerAction(generateDownloadUrl, {
    onSuccess: ({ data }) => {
      toast.success('Downloading file...')
      window.open(data.url, '_blank')
    },
    onError: (error) => displayErrors(error),
  })

  return (
    <main>
      <form
        onSubmit={handleSubmit((values) => {
          return action.execute({ ...values, price: numberToCurrencyCents(Number(values.price)) })
        })}
      >
        <Grid>
          <Column size={12}>
            <h1>{isEdition ? 'Update' : 'New'} product</h1>
          </Column>

          {isEdition && initialValues?._id && (
            <Column size={12}>
              <Label>Content</Label>
              <br />
              <Button
                variant='secondary'
                loading={generateDownloadUrlAction.isPending}
                onClick={() => generateDownloadUrlAction.execute({ productId: initialValues?._id })}
              >
                Download file
              </Button>
            </Column>
          )}

          {!isEdition && (
            <>
              <Column size={4}>
                <Fieldset
                  label='Content'
                  error={formState.errors.file?.message}
                  info='Max of 5mb'
                  tooltip={`Aceppted formats: ${Object.keys(mimeTypes).join(', ')}`}
                >
                  <Controller
                    control={control}
                    name='file'
                    rules={{ required: requiredField }}
                    render={({ field }) => {
                      return (
                        <FileUpload
                          maxMb={5}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                          accept={Object.values(mimeTypes).join(' ')}
                        />
                      )
                    }}
                  />
                </Fieldset>
              </Column>

              <Column size={8} className='flex items-center h-full'>
                <p className={cn('text-xs text-muted-foreground')}>
                  Aceppted formats: {Object.keys(mimeTypes).join(', ')}
                </p>
              </Column>
            </>
          )}

          <Column size={4}>
            <Fieldset label='Name' error={formState.errors.name?.message}>
              <Input {...register('name', { required: requiredField })} placeholder='Type the product name' />
            </Fieldset>
          </Column>

          <Column size={4}>
            <Fieldset
              label='Slug (product alias)'
              error={formState.errors.name?.message}
              info='Only lowercase letters, minus and numbers'
            >
              <Controller
                name='slug'
                control={control}
                rules={{ required: requiredField }}
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

          <Column size={4}>
            <Fieldset
              label='Product price'
              info='Use american format (1234.30)'
              error={formState.errors.price?.message}
            >
              <div className={cn('relative', isEdition && 'opacity-50 cursor-not-allowed pointer-events-none')}>
                <Controller
                  control={control}
                  name='currency'
                  render={({ field }) => {
                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className='absolute text-xs left-1 bg-foreground/10 h-8 w-12 flex gap-1 items-center justify-center top-[50%] translate-y-[-50%]'>
                            {field.value.toUpperCase()}
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
                  {...register('price', {
                    required: requiredField,
                    validate: (value) => {
                      if (!/^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/.test(String(value))) {
                        return invalidValue
                      }
                      if (value < MIN_PRODUCT_PRICE / 100) {
                        return `The min price is ${formatCurrency(MIN_PRODUCT_PRICE, 'USD')}`
                      }
                      if (value > MAX_PRODUCT_PRICE / 100) {
                        return `The max price is ${formatCurrency(MAX_PRODUCT_PRICE, 'USD')}`
                      }
                    },
                  })}
                  type='number'
                  placeholder='Type the product price'
                  className='pl-16'
                />
              </div>
            </Fieldset>
          </Column>

          <Column size={4}>
            <Fieldset label='Category' error={formState.errors.category?.message}>
              <Controller
                control={control}
                rules={{ required: requiredField }}
                name='category'
                render={({ field }) => {
                  return (
                    <Select onValueChange={(e) => field.onChange(e)} value={field.value}>
                      <SelectTrigger hasValue={Boolean(field.value)} className={cn('w-full')}>
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
            <Fieldset label='Cover' error={formState.errors.cover?.message} info='Max of 2mb'>
              <Controller
                control={control}
                name='cover'
                render={({ field }) => {
                  return (
                    <FileUpload
                      maxMb={2}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      accept='image/*'
                    />
                  )
                }}
              />
            </Fieldset>
          </Column>

          <Column size={12}>
            <Fieldset label='Description' error={formState.errors.description?.message}>
              <Textarea {...register('description', { required: requiredField })} placeholder='Describe the product' />
            </Fieldset>
          </Column>

          <Column
            size={12}
            className='flex justify-end gap-2 items-center sticky bottom-2 backdrop-blur-sm z-20 py-4 my-8'
          >
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                const values = getValues()
                goToPreview(values)
              }}
            >
              Preview
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
