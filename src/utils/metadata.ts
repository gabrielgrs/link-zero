import type { Metadata } from 'next'
import { APP_DESCRIPTION, APP_DOMAIN, APP_NAME } from './constants/brand'

const meta = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
} as const

const image = `${APP_DOMAIN}/thumb.png`

export function generateMetadata(): Metadata {
  return {
    ...meta,
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`,
    },
    twitter: {
      ...meta,
      card: 'summary_large_image',
      images: [image],
    },
    metadataBase: new URL(APP_DOMAIN),
    openGraph: {
      ...meta,
      images: [image],
    },
    icons: [
      {
        rel: 'apple-touch-icon',
        sizes: '182x182',
        url: '/apple-icon.png',
      },
    ],
  }
}
