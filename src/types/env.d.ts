declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VERCEL_ENV: 'production' | 'development' | 'preview'
    JWT_SECRET: string
    RESEND_KEY: string
    MONGODB_URI: string
    BLOB_READ_WRITE_TOKEN: string
  }
}
