'use server'

import { db } from '@/libs/mongoose'
import { sendEmail } from '@/libs/resend'
import { parseData } from '@/utils/action'
import { z } from 'zod'
import { createServerAction } from 'zsa'

export const getLandingPageData = createServerAction().handler(async () => {
  const totalUsers = await db.user.countDocuments()
  const totalProducts = await db.product.countDocuments()
  const sales = await db.product.aggregate([
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
  const totalSales = sales[0].totalSales as number

  return parseData({ totalUsers, totalProducts, totalSales })
})

export const sendContactMessage = createServerAction()
  .input(z.object({ name: z.string().optional(), email: z.string(), message: z.string(), subject: z.string() }))
  .handler(async ({ input }) => {
    return sendEmail(
      'grxgabriel@gmail.com',
      `Contact form`,
      `<p>From ${input.name} (${input.email}), Subject: ${input.subject}, <br/> message: ${input.message}</p>`,
    )
  })
