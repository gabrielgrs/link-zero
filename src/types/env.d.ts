declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VERCEL_ENV: 'production' | 'development' | 'preview'
    JWT_SECRET: string
    MONGODB_URI: string
    STRIPE_SECRET_KEY: string
    STRIPE_CLIENT_ID: string
    STRIPE_WEBHOOK_SECRET: string
    RESEND_KEY: string
    BLOB_READ_WRITE_TOKEN: string
    GOOGLE_CLIENT_SECRET?: string
  }
}
