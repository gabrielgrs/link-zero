'use server'

import { createToken } from '@/libs/jose'
import { db } from '@/libs/mongoose'
import { sendEmailAsParagraphs } from '@/libs/resend'
import { createOrFindCustomerByEmail, findAccountByEmail } from '@/libs/stripe/utils'
import { parseData } from '@/utils/action'
import { jwtDecode } from 'jwt-decode'
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

export async function createOrFindUser(email: string, fields: RequiredUserFields) {
  const user = await db.user.findOne({ email })
  if (user) return user

  if (!fields.username) return null

  const customer = await createOrFindCustomerByEmail(email)
  const accountId = await findAccountByEmail(email)

  return db.user.create({
    email,
    name: fields.name,
    username: slugify(fields.username ?? '', {
      lower: true,
      strict: true,
      replacement: '-',
      trim: false,
    }),
    stripeCustomerId: customer.id,
    stripeAccountId: accountId,
  })
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
      username: input.username,
    })

    if (!userCreationResponse)
      return {
        status: 'SHOULD_REGISTER',
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

    return redirect(`/auth?token=${token}`)
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

export const signInWithGoogle = createServerAction()
  .input(z.object({ googleJWT: z.string().nonempty() }))
  .handler(async ({ input }) => {
    type GoogleDecodedToken = {
      email: string
      email_verified: boolean
      name: string
      picture: string
      given_name: string
      family_name: string
    }

    const usersCount = await db.user.countDocuments()

    const response: GoogleDecodedToken = await jwtDecode(input.googleJWT)

    if (!response.email_verified) throw new Error('Google email not verified')

    const userCreationResponse = await createOrFindUser(response.email, {
      name: `${response.given_name} ${response.family_name}`,
      username: `${response.email.split('@')[0]}-${usersCount}`,
    })

    if (!userCreationResponse) throw new Error('Failed to create user')

    const token = await createToken({
      _id: userCreationResponse._id,
      role: userCreationResponse.role,
    })

    return redirect(`/auth?token=${token}`)
  })

export const updateUser = authProcedure
  .input(z.object({ name: z.string().nonempty(), username: z.string(), bio: z.string() }))
  .handler(async ({ input, ctx }) => {
    await db.user.findOneAndUpdate(
      { _id: ctx.user._id },
      {
        name: input.name,
        username: slugify(input.username ?? '', {
          lower: true,
          strict: true,
          replacement: '-',
          trim: false,
        }),
        bio: input.bio,
      },
    )

    return true
  })
