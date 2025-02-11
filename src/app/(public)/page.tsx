import { Link } from '@/components/link'
import { Button } from '@/components/ui/button'
import { APP_DESCRIPTION } from '@/utils/constants/brand'

export default function Page() {
  return (
    <main>
      <section className='grid grid-cols-2 items-center gap-2 min-h-[40vh]'>
        <div className='space-y-4 py-8'>
          <p>Badge</p>
          <h1>{APP_DESCRIPTION}</h1>
          <div className='flex items-center gap-4'>
            <Link href='/dashboard'>
              <Button>Start selling</Button>
            </Link>
            <Link href='/contact'>
              <Button variant='secondary'>Get in touch</Button>
            </Link>
          </div>
        </div>
        <div>Banner</div>
      </section>
    </main>
  )
}
