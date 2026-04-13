import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
].join('; ')

function withCSP(res: NextResponse): NextResponse {
  res.headers.set('Content-Security-Policy', CSP)
  return res
}

export default auth((req) => {
  const url = req.nextUrl

  const isTestRequest =
    process.env.NODE_ENV === 'test' ||
    (process.env.NODE_ENV !== 'production' &&
      (req.headers.get('x-playwright-test') === 'true' ||
        req.headers.get('x-test-auth') === 'true' ||
        req.headers.get('user-agent')?.includes('Playwright')))

  if (isTestRequest) return withCSP(NextResponse.next())

  // Allow NextAuth OAuth callback and Sentry tunnel through unconditionally
  if (
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/monitoring')
  ) {
    return NextResponse.next()
  }

  const isAuth = !!req.auth

  if (url.pathname.startsWith('/dashboard') && !isAuth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(req.url))
    return withCSP(NextResponse.redirect(loginUrl))
  }

  if (url.pathname.startsWith('/api/v1') && !isAuth) {
    return withCSP(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
  }

  return withCSP(NextResponse.next())
})

export const config = {
  // Exclude monitoring tunnel, Next.js internals, and static files per Sentry SKILL.md
  matcher: ['/((?!monitoring|_next/static|_next/image|favicon.ico).*)'],
}
