import { getUserByUsername } from '@/actions/auth'
import { getProductsByUser } from '@/actions/product'
import { UserClient } from './client'

type Props = {
  params: Promise<{ username: string }>
}

export default async function Page({ params }: Props) {
  const { username } = await params

  const [user, error] = await getUserByUsername(username)
  if (error) throw error

  const [products, productsError] = await getProductsByUser({ userId: user._id })
  if (productsError) throw productsError

  return <UserClient user={user} products={products} />
}
