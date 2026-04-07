import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@ai-sdk/google',
    '@ai-sdk/openai',
    '@ai-sdk/anthropic',
    '@sentry/nextjs',
  ],

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
  // Required — falls back to empty string so TS is happy;
  // set SENTRY_ORG / SENTRY_PROJECT in Vercel env vars
  org: process.env.SENTRY_ORG ?? '',
  project: process.env.SENTRY_PROJECT ?? '',

  authToken: process.env.SENTRY_AUTH_TOKEN,

  widenClientFileUpload: true,

  // Proxy Sentry requests through /monitoring to bypass ad-blockers
  tunnelRoute: '/monitoring',

  // Suppress output unless in CI
  silent: !process.env.CI,

  // Disable source map upload if auth token is missing (local dev)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
})
