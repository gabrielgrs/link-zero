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

export const mimeTypes = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  doc: 'application/msword',
  // docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: 'application/vnd.ms-excel',
  // xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: 'application/vnd.ms-powerpoint',
  // pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  mp4: 'video/mp4',
  webm: 'video/webm',
  avi: 'video/x-msvideo',
  zip: 'application/zip',
} as const

export type ProductSchema = {
  _id: string
  name: string
  slug: string
  cover?: string
  currency: Currency
  price: number
  description: string
  content: {
    url: string
    format: keyof typeof mimeTypes | 'custom'
  }
  user: Types.ObjectId
  details: { label: string; value: string }[]
  category: keyof typeof categories
  active: boolean
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
    default: 'pending',
  },
  price: {
    type: Number,
    required: true,
    immutable: true,
  },
})

export const product = createMongooseSchema<ProductSchema>(
  'Product',
  new Schema<ProductSchema>(
    {
      slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: [true, 'Slug already exists'],
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
      },
      cover: {
        type: String,
        required: false,
      },
      currency: {
        type: String,
        required: [true, 'Currency is required'],
        enum: currencies,
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        immutable: true,
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
      },
      content: {
        type: {
          url: {
            type: String,
            required: true,
          },
          format: {
            type: String,
            required: true,
            enum: [...Object.keys(mimeTypes), 'custom'],
          },
        },
        required: true,
        select: false,
      },
      active: {
        type: Boolean,
        default: false,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
      },
      details: {
        type: [{ label: String, value: String }],
        required: [true, 'Details are required'],
      },
      category: {
        type: String,
        enum: Object.keys(categories),
        required: [true, 'Category is required'],
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
