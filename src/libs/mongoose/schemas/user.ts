import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type UserSchema = {
  _id: string
  name: string
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export const user = createMongooseSchema<UserSchema>(
  'User',
  new Schema<UserSchema>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 32,
      },
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 32,
      },
    },
    {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  ),
)
