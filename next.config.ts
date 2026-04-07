import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  // Required for @ai-sdk/* Node.js-only packages
  serverExternalPackages: ['@ai-sdk/google', '@ai-sdk/openai', '@ai-sdk/anthropic'],

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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Source map upload auth token — set SENTRY_AUTH_TOKEN in Vercel env vars
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload wider set of client files for better stack trace resolution
  widenClientFileUpload: true,

  // Proxy Sentry requests through /monitoring to bypass ad-blockers
  tunnelRoute: '/monitoring',

  // Suppress output unless in CI
  silent: !process.env.CI,
})
