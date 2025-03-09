import { NextRequest, NextResponse } from 'next/server'
import { cookiesConfigs } from './utils/cookies/configs'

const RATE_LIMIT_IN_MS = 1000
const MAX_REQUESTS = 20
const ipTracker = new Map<string, { count: number; startTime: number }>()

const blackListRoutes: string[] = ['/wp-admin/setup-config.php', '/wordpress/wp-admin/setup-config.php']
const blackListIps: string[] = []

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (!ipTracker.has(ip)) {
    ipTracker.set(ip, { count: 1, startTime: Date.now() })
  } else {
    const data = ipTracker.get(ip)!
    if (Date.now() - data.startTime > RATE_LIMIT_IN_MS) {
      // Reset window
      ipTracker.set(ip, { count: 1, startTime: Date.now() })
    } else {
      data.count += 1
      if (data.count > MAX_REQUESTS) {
        return NextResponse.json({ message: 'Too many requests' }, { status: 429 })
      }
    }
  }

  const { origin } = request.nextUrl
  const redirectTo = request.nextUrl.searchParams.get('redirectTo')
  const token = request.nextUrl.searchParams.get('token')

  if (blackListRoutes.some((x) => request.url.includes(x))) blackListIps.push(ip)

  if (blackListIps.includes(ip)) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  if (request.url.includes('/logout')) {
    const response = NextResponse.redirect(new URL(redirectTo || '/auth', origin))

    response.cookies.delete('token')
    return response
  }

  if (request.url.includes('/auth') && token) {
    const response = NextResponse.redirect(new URL(redirectTo || '/dashboard', origin))
    response.cookies.set('token', token, cookiesConfigs)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|assets|icons).*)'],
}
