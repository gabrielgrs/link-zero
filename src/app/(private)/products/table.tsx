'use client'

import { getUserProducts, publishOrUnpublishProduct } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ServerActionResponse } from '@/utils/action'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { DownloadButton } from '../library/download-button'
import { PreviewLink } from './preview-link'

type Props = {
  products: ServerActionResponse<typeof getUserProducts>
}

export function ProductsTable({ products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts)

  const publishOrUnpublishProductAction = useServerAction(publishOrUnpublishProduct, {
    onSuccess: ({ data }) => {
      setProducts((p) => p.map((item) => (item._id === data.productId ? { ...item, published: data.published } : item)))
      toast.success('Product updated')
    },
    onError: () => {
      toast.error('Failed. Try again later.')
    },
  })

  return (
    <main>
      <Grid>
        <Column size={12} className='flex justify-between items-center gap-2'>
          <h1>Products</h1>
          <Link href='/products/form'>
            <Button>New product</Button>
          </Link>
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
                        <PreviewLink
                          href={`/product/${item.slug}`}
                          className='text-xs text-muted-foreground text-ellipsis'
                          target='_blank'
                        />
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
                        {item.published ? (
                          <Badge variant='default'>Published</Badge>
                        ) : (
                          <Badge variant='destructive'>Unpublished</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DownloadButton productId={item._id} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            <EllipsisVertical className='text-muted-foreground' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <button
                              className='w-full'
                              onClick={() =>
                                publishOrUnpublishProductAction.execute({
                                  productId: item._id,
                                  published: !item.published,
                                })
                              }
                            >
                              {item.published ? 'Unpublish' : 'Publish'}
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem>Remove</DropdownMenuItem>
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
