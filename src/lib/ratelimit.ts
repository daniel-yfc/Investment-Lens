/**
 * Persistent rate limiter using Upstash Redis + @upstash/ratelimit
 * Survives serverless cold starts and scales across multiple function instances.
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Falls back to a no-op limiter in test environments.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const isTest = process.env.NODE_ENV === 'test'

// No-op limiter for test environment (no Redis needed)
const noopLimiter = {
  limit: async (_identifier: string) => ({
    success: true,
    limit: 9999,
    remaining: 9998,
    reset: Date.now() + 60_000,
    pending: Promise.resolve(),
  }),
}

function createRatelimit() {
  if (isTest) return noopLimiter as unknown as Ratelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    // Graceful degradation: warn but don't crash at module load time
    console.warn(
      '[ratelimit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. ' +
      'Rate limiting is DISABLED. Set these env vars in Vercel Dashboard.'
    )
    return noopLimiter as unknown as Ratelimit
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(20, '60 s'),
    analytics: true,
    prefix: 'investment-lens:ratelimit',
  })
}

export const ratelimit = createRatelimit()
