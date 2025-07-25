import { getUserLibraryProducts } from '@/actions/product'
import { Column, Grid } from '@/components/grid'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
// import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import dayjs from 'dayjs'
// import { EllipsisVertical } from 'lucide-react'
import { DownloadButton } from './download-button'
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
            <p className='text-muted-foreground text-sm'>My list of products</p>
          </div>
          <Link href='/store' className={buttonVariants()}>
            Search products
          </Link>
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

                    <TableCell className='flex justify-end items-center gap-2'>
                      <DownloadButton productId={item._id} />
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline' size='icon'>
                            <EllipsisVertical className='text-muted-foreground' size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
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
