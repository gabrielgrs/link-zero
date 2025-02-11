import { decodeToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
import { cookies } from 'next/headers'
import { createServerActionProcedure } from 'zsa'
// import { redirectWhenError } from './shared'

export const authProcedure = createServerActionProcedure()
  .handler(async () => {
    const cookiesData = await cookies()

    const token = cookiesData.get('token')?.value
    if (!token) throw new Error('Unauthorized')

    const tokenData = await decodeToken(token)
    if (!tokenData) throw new Error('Unauthorized')

    const user = await db.user.findOne({ _id: tokenData._id }).lean()
    if (!user) throw new Error('Unauthorized')

    return parseData({ user })
  })
  .createServerAction()
