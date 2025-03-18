import { Link } from '@/components/link'

export function Footer() {
  return (
    <footer className='border-t'>
      <div className='flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12'>
        <div className='flex-1 space-y-4'>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-bold tracking-tighter'>Link Zero</span>
          </div>
          <p className='text-sm text-muted-foreground'>The easiest way to create and sell digital products online.</p>
        </div>
        <div className='grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4'>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>Product</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Features
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  About
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>Resources</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Guides
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium'>Legal</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Terms
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Privacy
                </Link>
              </li>
              <li>
                <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='border-t pt-6'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <p className='text-center text-sm text-muted-foreground md:text-left'>
            © {new Date().getFullYear()} Link Zero. All rights reserved.
          </p>
          <div className='flex gap-4'>
            <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
              <span className='sr-only'>Twitter</span>
            </Link>
            <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
              <span className='sr-only'>Instagram</span>
            </Link>
            <Link href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
              <span className='sr-only'>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
