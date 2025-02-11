'use server'
import { createToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { sendEmailAsParagraphs } from '@/libs/resend'
import { parseData } from '@/utils/action'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import slugify from 'slugify'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'

type RequiredUserFields = {
  name?: string
  username?: string
}

async function createOrFindUser(email: string, fields: RequiredUserFields) {
  const user = await db.user.findOne({ email })
  if (user) return user

  if (!fields.name) return 'SHOULD_REGISTER'
  if (!fields.username) return 'SHOULD_REGISTER'

  return db.user.create({ email, name: fields.name, username: fields.username })
}

export const authenticate = createServerAction()
  .input(
    z.object({
      email: z.string(),
      code: z.string().optional(),
      name: z.string().optional(),
      username: z.string().optional(),
    }),
  )
  .handler(async ({ input }): Promise<{ status: 'AUTHORIZED' | 'WAITING_FOR_CODE' | 'SHOULD_REGISTER' }> => {
    const userCreationResponse = await createOrFindUser(input.email, {
      name: input.name,
      username: slugify(input.username ?? '', {
        lower: true,
        strict: true,
        replacement: '-',
        trim: false,
      }),
    })

    if (typeof userCreationResponse === 'string')
      return {
        status: userCreationResponse,
      }

    if (!userCreationResponse) {
      return { status: 'SHOULD_REGISTER' }
    }

    if (!input.code) {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
      await db.session.create({ email: userCreationResponse.email, code: generatedCode })
      await sendEmailAsParagraphs(input.email, 'Verification Code', [
        `Hello!`,
        'Here is your verification code',
        `<strong>${generatedCode}</strong>`,
      ])
      return {
        status: 'WAITING_FOR_CODE',
      }
    }

    const isValidCode = await db.session.findOne({ email: input.email, code: input.code })

    if (!isValidCode) throw new Error('Unauthorized')

    const token = await createToken({
      _id: userCreationResponse._id,
      role: userCreationResponse.role,
    })
    const cookiesData = await cookies()
    cookiesData.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
    })

    return {
      status: 'AUTHORIZED',
    }
  })

export const getAuthenticatedUser = authProcedure.handler(async ({ ctx }) => {
  return parseData(ctx.user)
})

export const getUserByUsername = createServerAction()
  .input(z.string())
  .handler(async ({ input: username }) => {
    const data = await db.user.findOne({ username }, { stripeCustomerId: false, stripeSubscriptionId: false })

    if (!data) return redirect('/not-found')

    return parseData(data.toJSON())
  })

export const signOut = createServerAction().handler(async () => {
  const cookiesData = await cookies()

  cookiesData.delete('token')

  return true
})
