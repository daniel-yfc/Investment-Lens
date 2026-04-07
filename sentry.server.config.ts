import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Capture 10% of transactions for performance monitoring
  // Increase to 1.0 for initial debug, then reduce for production cost
  tracesSampleRate: 0.1,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Ignore common non-actionable errors
  ignoreErrors: [
    'AbortError',
    'The user aborted a request',
    'ResizeObserver loop limit exceeded',
  ],
})
