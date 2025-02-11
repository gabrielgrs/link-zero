import type { Metadata } from 'next'
import { Geist_Mono as Font } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/root-client-layout'
import { APP_DESCRIPTION, APP_NAME } from '@/utils/constants/brand'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

const fontElement = Font({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={` ${fontElement.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
