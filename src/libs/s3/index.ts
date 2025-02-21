import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/link-zero`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})

export async function uploadFile(file: File, isPublic = false) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const key = `${isPublic ? 'public' : 'private'}/${Date.now()}-${Math.random()}-${file.name}`

  await s3.send(
    new PutObjectCommand({
      Bucket: 'link-zero',
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  )

  return { key }
}

export async function removeFile(key: string) {
  await s3.send(
    new PutObjectCommand({
      Bucket: 'link-zero',
      Key: key,
    }),
  )
}

export async function getFileUrl(key: string, expiresInMinutes = 3) {
  const command = new GetObjectCommand({
    Bucket: 'link-zero',
    Key: key,
  })

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: expiresInMinutes,
  })

  return signedUrl
}
