'use server'

import { db } from '@/libs/mongoose'
import { parseData } from '@/utils/action'
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
