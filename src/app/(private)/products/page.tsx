import { getUserProducts } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EllipsisVertical } from 'lucide-react'
// import { DownloadButton } from './download-button'
import { PreviewLink } from './preview-link'

export default async function Page() {
  const [products, error] = await getUserProducts()
  if (error) throw error

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
                    <TableCell className='text-right'>
                      {/* <DownloadButton productId={item._id} /> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline'>
                            <EllipsisVertical className='text-muted-foreground' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
