import { Geist_Mono as Font } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/root-client-layout'
import { generateMetadata } from '@/utils/metadata'
import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'

export const metadata = generateMetadata()

const fontElement = Font({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={` ${fontElement.className} antialiased`}>
        <NextTopLoader color='hsl(var(--foreground))' showSpinner={true} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
