'use client'

import { createProduct } from '@/actions/product'
import { Fieldset } from '@/components/fieldset'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Product } from '@/components/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { categories } from '@/utils/categories'
import { cn } from '@/utils/cn'
import { requiredField } from '@/utils/messages'
import { Trash } from 'lucide-react'
import { Fragment } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

const defaultValues = {
  name: '',
  cover: '',
  content: '',
  price: 0,
  category: '',
  characteristics: [] as { label: string; value: string }[],
  slug: '',
}

export default function Page() {
  const { control, register, formState, handleSubmit, setValue } = useForm({ defaultValues })
  const name = useWatch({ control, name: 'name' })
  const price = useWatch({ control, name: 'price' })
  const cover = useWatch({ control, name: 'cover' })
  const category = useWatch({ control, name: 'category' })
  const content = useWatch({ control, name: 'content' })
  const slug = useWatch({ control, name: 'slug' })
  const characteristics = useWatch({ control, name: 'characteristics' })
  const characteristicsFieldArray = useFieldArray({ control, name: 'characteristics' })
  const { user } = useAuth()

  const createProductAction = useServerAction(createProduct, {
    onSuccess: () => {
      toast.success('Success!')
    },
    onError: () => {
      toast.error('Error.')
    },
  })

  return (
    <main>
      <form onSubmit={handleSubmit((values) => createProductAction.execute(values))}>
        <Grid>
          <Column size={12}>
            <h1>Publish a new product</h1>
          </Column>

          <Column size={6}>
            <Fieldset label='Cover URL' error={formState.errors.cover?.message}>
              <Input {...register('cover', { required: requiredField })} placeholder='Product Cover' />
            </Fieldset>
          </Column>

          <Column size={6}>
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

          <Column size={8}>
            <Fieldset label='Name' error={formState.errors.name?.message}>
              <Input {...register('name', { required: requiredField })} placeholder='Type the product name' />
            </Fieldset>
          </Column>

          <Column size={4}>
            <Fieldset label='Product price' error={formState.errors.price?.message}>
              <Input {...register('price', { required: requiredField })} placeholder='Type the product price' />
            </Fieldset>
          </Column>

          <Column size={12}>
            <Label>Category</Label>
            <div className='flex flex-wrap items-center gap-1'>
              {Object.entries(categories).map(([key, value]) => (
                <button
                  key={key}
                  type='button'
                  className={cn(
                    'text-sm text-muted-foreground border-primary/20 border-[1px] py-1 px-2 rounded-full duration-500',
                    category === key && 'border-primary bg-foreground text-background',
                  )}
                  onClick={() => setValue('category', key)}
                >
                  {value}
                </button>
              ))}
            </div>
          </Column>

          <Column size={12}>
            <Fieldset label='Description' error={formState.errors.content?.message}>
              <Textarea {...register('content', { required: requiredField })} placeholder='Describe the product' />
            </Fieldset>
          </Column>

          <Column size={12}>
            <Grid>
              <Column size={12}>
                <Label>Characteristics</Label>
              </Column>

              {characteristicsFieldArray.fields.map((f, index) => (
                <Fragment key={f.id}>
                  <Column size={5}>
                    <Input {...register(`characteristics.${index}.label`)} placeholder='Label' />
                  </Column>
                  <Column size={5}>
                    <Input {...register(`characteristics.${index}.value`)} placeholder='' />
                  </Column>
                  <Column size={2}>
                    <Button type='button' variant='destructive'>
                      <Trash />
                    </Button>
                  </Column>
                </Fragment>
              ))}
              <Column size={12}>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => characteristicsFieldArray.append({ label: '', value: '' })}
                >
                  Add characteristic
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
              price={price}
              cover={cover}
              user={user}
              content={content}
              characteristics={characteristics}
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

            <Link href='/products/form'>
              <Button type='submit'>Save product</Button>
            </Link>
          </Column>
        </Grid>
      </form>
    </main>
  )
}
