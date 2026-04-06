import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for @ai-sdk/google and other Node.js-only AI SDK packages
  serverExternalPackages: ['@ai-sdk/google', '@ai-sdk/openai', '@ai-sdk/anthropic'],

  // Silence build warnings for optional peer deps in AI SDK
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

export default nextConfig
