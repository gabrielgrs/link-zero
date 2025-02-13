import { APP_NAME } from '@/utils/constants/brand'
import { copy, del, put } from '@vercel/blob'

const BUCKET = APP_NAME.replace(' ', '-').toLowerCase()

export const uploadFile = (file: File) =>
  put(`${BUCKET}/${file.name}`, file, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN })

export const removeFile = (fileName: string) =>
  del(fileName, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

export const duplicateFile = (fileName: string, fileCopyName: string) =>
  copy(fileName, `${BUCKET}/${fileCopyName}`, { token: process.env.BLOB_READ_WRITE_TOKEN, access: 'public' })
