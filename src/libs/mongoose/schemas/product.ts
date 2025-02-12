import { categories } from '@/utils/categories'
import { Currency, currencies } from '@/utils/constants/currencies'
import { Schema, Types } from 'mongoose'
import { createMongooseSchema } from '../helpers'

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
  stripeProductId: string
  stripePriceId: string
  createdAt: Date
  updatedAt: Date
}

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
      stripeProductId: {
        type: String,
        required: true,
        unique: true,
      },
      stripePriceId: {
        type: String,
        required: true,
        unique: true,
      },
    },
    {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  ),
)
