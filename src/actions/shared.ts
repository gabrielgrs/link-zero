'use server'

import { db } from '@/libs/mongoose'
import { ProductSchema } from '@/libs/mongoose/schemas/product'
import { sendEmail } from '@/libs/resend'
import { parseData } from '@/utils/action'
import { CONTACT_EMAIL } from '@/utils/constants/brand'
import { z } from 'zod'
import { createServerAction } from 'zsa'
import { authProcedure } from './procedures'

export const getDashboardData = authProcedure.handler(async ({ ctx }) => {
  const userProducts = await db.product.find({ user: ctx.user._id }).lean()
  const allSales = userProducts.reduce((acc: ProductSchema['sales'], curr) => acc.concat(curr.sales), [])

  return parseData({
    allSales,
  })
})

export const getLandingPageData = createServerAction().handler(async () => {
  const [totalUsers, totalProducts, totalSales] = await Promise.all([
    db.user.countDocuments(),
    db.product.countDocuments(),
    db.product
      .aggregate([
        {
          $unwind: '$sales',
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: 1,
            },
          },
        },
      ])
      .then((res) => Number(res[0]?.totalSales ?? 0)),
  ])

  return parseData({ totalUsers, totalProducts, totalSales })
})

export const sendContactMessage = createServerAction()
  .input(z.object({ name: z.string().optional(), email: z.string(), message: z.string(), subject: z.string() }))
  .handler(async ({ input }) => {
    return sendEmail(
      CONTACT_EMAIL,
      `Contact form`,
      `<p>From ${input.name} (${input.email}), Subject: ${input.subject}, <br/> message: ${input.message}</p>`,
    )
  })
