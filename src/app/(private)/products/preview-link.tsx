'use client'

import { Link } from '@/components/link'

export function PreviewLink({ href, className, target }: { href: string; className?: string; target?: '_blank' }) {
  return (
    <Link href={href} className={className} target={target}>
      {`${window.location.origin}/${href}`}
    </Link>
  )
}
