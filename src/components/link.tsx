import NextLink, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>

export function Link({ prefetch = false, children, className, ...rest }: Props) {
  return (
    <NextLink {...rest} prefetch={prefetch} className={className}>
      {children}
    </NextLink>
  )
}
