'use client'

import { getAuthUserProducts, updateProductStatus } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { ServerActionResponse } from '@/utils/action'
import { cn } from '@/utils/cn'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { PreviewLink } from './preview-link'

type Props = {
  products: ServerActionResponse<typeof getAuthUserProducts>
}

function getStatusBadgeClassName(status: Props['products'][number]['status']) {
  if (status === 'PUBLISHED') return 'bg-green-400 text-green-900'
  if (status === 'DRAFT') return 'bg-gray-400 text-gray-900'
  if (status === 'UNLISTED') return 'bg-yellow-300 text-yellow-900'
}

export function ProductsTable({ products: initialProducts }: Props) {
  const { user } = useAuth()
  const [products, setProducts] = useState(initialProducts)

  const updateProductStatusAction = useServerAction(updateProductStatus, {
    onSuccess: ({ data }) => {
      setProducts((p) => p.map((item) => (item._id === data.productId ? { ...item, status: data.status } : item)))
      toast.success('Product updated')
    },
    onError: (error) => {
      toast.error(error.err.message || 'Failed. Try again later.')
    },
  })

  return (
    <main>
      <Grid>
        <Column size={12} className='flex justify-between items-center gap-2'>
          <h1>Products</h1>
          {user.stripeAccountId ? (
            <Link href='/products/form' className={buttonVariants()}>
              New product
            </Link>
          ) : (
            <Button disabled>New product</Button>
          )}
        </Column>
        <Column size={12}>
          <Table>
            <TableCaption>{products.length > 0 ? 'Products list' : 'No products found'}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => {
                return (
                  <TableRow key={item._id}>
                    <TableCell className='font-medium'>
                      <div>
                        <p>{item.name}</p>
                        {item.status === 'PUBLISHED' && (
                          <PreviewLink
                            href={`/product/${item.slug}`}
                            className='text-xs text-muted-foreground text-ellipsis'
                            target='_blank'
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.sales.length}</TableCell>
                    <TableCell>
                      {Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency.toUpperCase() }).format(
                        item.price / 100,
                      )}
                    </TableCell>
                    <TableCell>
                      <button>
                        <Badge className={cn('capitalize', getStatusBadgeClassName(item.status))}>
                          {item.status?.toLowerCase()}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className='flex items-center justify-end gap-2'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline' size='icon'>
                            <EllipsisVertical className='text-muted-foreground' size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <button
                              className='w-full capitalize'
                              onClick={() => {
                                updateProductStatusAction.execute({
                                  productId: item._id,
                                  status: item.status !== 'PUBLISHED' ? 'PUBLISHED' : 'UNLISTED',
                                })
                              }}
                            >
                              {item.status === 'PUBLISHED' ? 'Unlist' : 'Publish'}
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link className={`w-full`} href={`/products/form/${item.slug}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>Preview</DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Column>
      </Grid>
    </main>
  )
}
