import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: process.env.NODE_ENV === 'production',
  ignoreErrors: [
    'AbortError',
    'The user aborted a request',
    'ResizeObserver loop limit exceeded',
    'ChunkLoadError',
  ],
  // Replay: capture 1% of sessions, 10% of error sessions
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 0.1,
})
