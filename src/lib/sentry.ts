/**
 * Sentry client helper — safe to import in both server and client components.
 * Actual initialisation is done in sentry.server.config.ts / sentry.client.config.ts.
 *
 * Usage:
 *   import * as Sentry from '@sentry/nextjs'
 *   Sentry.captureException(err)
 */
export { captureException, captureMessage, setUser, withScope } from '@sentry/nextjs'
