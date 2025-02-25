import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy-link/:path*',
        destination: '/api/proxy?path=/:path*',
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
  trailingSlash: true,
  env: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  images: {
    remotePatterns: [
      {
        hostname: '7izlrmyww7k6yebp.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
