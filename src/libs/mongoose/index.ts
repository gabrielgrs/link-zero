import mongoose from 'mongoose'

import { link } from './schemas/link'
import { product } from './schemas/product'
import { session } from './schemas/session'
import { user } from './schemas/user'

let connection: typeof mongoose | null = null

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (connection) return connection
  connection = await mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI)
  return connection
}

connectDatabase()

export const db = {
  user,
  product,
  link,
  session,
}
