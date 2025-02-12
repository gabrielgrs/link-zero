import { getUserLibraryProducts } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import dayjs from 'dayjs'
import { EllipsisVertical } from 'lucide-react'
import { PreviewLink } from './preview-link'

export default async function Page() {
  const [products, error] = await getUserLibraryProducts()
  if (error) throw error

  return (
    <main>
      <Grid>
        <Column size={12} className='flex justify-between items-center gap-2'>
          <div>
            <h1>Library</h1>
            <p className='text-muted-foreground text-sm'>Bought products</p>
          </div>
        </Column>
        <Column size={12}>
          <Table>
            <TableCaption>{products.length > 0 ? 'Products list' : 'No products found'}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Bouth at</TableHead>
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
                    <TableCell>
                      {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price / 100)}
                    </TableCell>
                    <TableCell>{dayjs(item.createdAt).format('DD MMM, YYYY')}</TableCell>

                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            <EllipsisVertical className='text-muted-foreground' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
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
