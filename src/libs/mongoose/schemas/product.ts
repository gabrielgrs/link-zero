import { categories } from '@/utils/categories'
import { Currency, currencies } from '@/utils/constants/currencies'
import { Schema, Types } from 'mongoose'
import { createMongooseSchema } from '../helpers'

type SaleSchema = {
  _id: string
  user: Types.ObjectId
  status: 'pending' | 'success' | 'failure'
  price: number
  createdAt: Date
  updatedAt: Date
}

export type ProductSchema = {
  _id: string
  name: string
  slug: string
  cover?: string
  currency: Currency
  price: number
  content: string
  user: Types.ObjectId
  characteristics: { label: string; value: string }[]
  category: keyof typeof categories
  stripeProductId?: string
  stripePriceId?: string
  sales: SaleSchema[]
  createdAt: Date
  updatedAt: Date
}

const saleSchema = new Schema<SaleSchema>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'success', 'failure'],
  },
  price: {
    type: Number,
    required: true,
  },
})

export const product = createMongooseSchema<ProductSchema>(
  'Product',
  new Schema<ProductSchema>(
    {
      slug: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      cover: {
        type: String,
        required: false,
      },
      currency: {
        type: String,
        required: true,
        enum: currencies,
      },
      price: {
        type: Number,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      characteristics: {
        type: [{ label: String, value: String }],
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: Object.keys(categories),
      },
      sales: {
        type: [saleSchema],
        required: false,
        default: [],
      },
      stripeProductId: {
        type: String,
        required: false,
      },
      stripePriceId: {
        type: String,
        required: false,
      },
    },
    {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  ),
)
