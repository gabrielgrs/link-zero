import { linkStripeAccountByCode } from '@/actions/stripe'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (code) {
    await linkStripeAccountByCode({ code })
  }

  return redirect('/dashboard')
}
