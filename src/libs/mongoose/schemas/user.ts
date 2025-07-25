import { Schema } from 'mongoose'
import { createMongooseSchema } from '../helpers'

export type UserSchema = {
  _id: string
  name?: string
  bio?: string
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  stripeCustomerId: string
  stripeAccountId?: string
  createdAt: Date
  updatedAt: Date
}

export const user = createMongooseSchema<UserSchema>(
  'User',
  new Schema<UserSchema>(
    {
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Slug already exists'],
        immutable: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
      },
      username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists'],
        minlength: [3, 'Username should be at least 3 characters long'],
        maxlength: [32, 'Username should be at most 32 characters long'],
        trim: true,
      },
      name: {
        type: String,
        required: false,
        minlength: [3, 'Name should be at least 3 characters long'],
        maxlength: [32, 'Name should be at most 32 characters long'],
        trim: true,
      },
      bio: {
        type: String,
        required: false,
        minlength: [3, 'Bio should be at least 3 characters long'],
        maxlength: [500, 'Bio should be at most 500 characters long'],
      },
      stripeCustomerId: {
        type: String,
        required: true,
        unique: true,
      },
      stripeAccountId: {
        type: String,
        required: false,
        unique: false,
      },
    },
    {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  ),
)
