import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { origin } = request.nextUrl
  const redirectTo = request.nextUrl.searchParams.get('redirectTo')

  if (request.url.includes('/logout')) {
    const response = NextResponse.redirect(new URL(redirectTo || '/', origin))

    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)'],
}
