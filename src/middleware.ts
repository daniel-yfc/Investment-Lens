import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const url = req.nextUrl;
  const isAuth = !!req.auth;

  // FA-07: Redirect unauthenticated requests to /dashboard/* to /login
  if (url.pathname.startsWith('/dashboard') && !isAuth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(req.url));
    const redirectResponse = NextResponse.redirect(loginUrl);

    // Ensure CSP headers are on redirects too, per SE-03
    const cspHeader = "script-src 'self';";
    redirectResponse.headers.set('Content-Security-Policy', cspHeader);
    return redirectResponse;
  }

  // SE-01: Return 401 for unauthenticated requests to /api/v1/*
  if (url.pathname.startsWith('/api/v1') && !isAuth) {
    const unauthorizedResponse = NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
    const cspHeader = "script-src 'self';";
    unauthorizedResponse.headers.set('Content-Security-Policy', cspHeader);
    return unauthorizedResponse;
  }

  // SE-03: Set CSP Header correctly (script-src 'self'), without unsafe-inline
  const response = NextResponse.next();
  // Using strict single CSP rule as requested by Acceptance_Criteria: CSP Header 正確設定（script-src 'self'），無 unsafe-inline
  const cspHeader = "script-src 'self';";

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
