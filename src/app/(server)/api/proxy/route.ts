import { db } from '@/libs/mongoose'
import { ProductSchema, mimeTypes } from '@/libs/mongoose/schemas/product'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // const contentType = req.nextUrl.searchParams.get('contentType') ?? ''
  const identifier = req.nextUrl.searchParams.get('identifier') ?? ''

  const link = await db.link.findOne({ _id: identifier }).populate<{ product: ProductSchema }>({
    path: 'product',
    select: 'content',
  })

  if (!link?.product) return new NextResponse('File not found', { status: 404 })
  const { url, format } = link.product.content

  if (format === 'custom') return NextResponse.redirect(url)

  const response = await fetch(url, {
    headers: {
      Accept: '*',
    },
  })

  if (!response.ok) {
    return new NextResponse('Failed to get file', { status: response.status })
  }

  const pdfBuffer = await response.arrayBuffer()
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': mimeTypes[format],
      'Content-Disposition': `inline; filename="arquivo.${format}"`, // Abre direto no navegador
    },
  })
}
