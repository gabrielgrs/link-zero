import { getAuthenticatedUser } from '@/actions/auth'
import { getProductBySlug } from '@/actions/product'
import { ServerActionResponse } from '@/utils/action'
import { ProductClient } from '../client'

type Props = {
  searchParams: Promise<ServerActionResponse<typeof getProductBySlug>>
}

export default async function Page({ searchParams }: Props) {
  const [authUser, error] = await getAuthenticatedUser()
  if (error) throw error

  const params = await searchParams
  return <ProductClient product={{ ...params, user: authUser, sales: [] }} isPreview />
}
