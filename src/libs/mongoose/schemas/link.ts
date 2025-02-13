import { Schema, Types } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type Link = {
  _id: string
  product: Types.ObjectId
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export const link = createMongooseSchema<Link>(
  'Link',
  new Schema<Link>(
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      expiresAt: {
        type: Date,
        expires: 60 * 2, // Expires in 2 minutes
        default: Date.now,
      },
    },
    {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  ),
)
