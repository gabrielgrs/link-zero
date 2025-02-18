import { NextRequest, NextResponse } from 'next/server'
import { cookiesConfigs } from './utils/cookies/configs'

export async function middleware(request: NextRequest) {
  const { origin } = request.nextUrl
  const redirectTo = request.nextUrl.searchParams.get('redirectTo')
  const token = request.nextUrl.searchParams.get('token')

  if (request.url.includes('/logout')) {
    const response = NextResponse.redirect(new URL(redirectTo || '/', origin))

    response.cookies.delete('token')
    return response
  }

  if (request.url.includes('/auth') && token) {
    const response = NextResponse.redirect(new URL(redirectTo || '/dashboard', origin))
    response.cookies.set('token', token, cookiesConfigs)
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)'],
}
