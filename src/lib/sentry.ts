/**
 * Sentry re-export helper — safe to import in both server and client components.
 * Actual init is done in instrumentation.ts (server/edge) and instrumentation-client.ts (browser).
 */
export { captureException, captureMessage, setUser, withScope, logger } from '@sentry/nextjs'
