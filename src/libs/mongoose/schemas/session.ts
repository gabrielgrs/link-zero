import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type Session = {
  _id: string
  email: string
  code: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export const session = createMongooseSchema<Session>(
  'Session',
  new Schema<Session>(
    {
      email: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Date,
        expires: 10 * 60,
        default: Date.now,
      },
    },
    {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  ),
)
