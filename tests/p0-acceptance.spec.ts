import { test, expect } from '@playwright/test';

test.describe('P0 Acceptance Criteria tests', () => {

  test('FA-07: Unauthenticated access to /dashboard/* redirects to /login', async ({ page }) => {
    // Attempt to access a protected route
    const response = await page.goto('http://localhost:3000/dashboard/portfolio');

    // Check if it redirected to the login page
    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('callbackUrl=');
  });

  test('SE-01: Unauthenticated access to /api/v1/* returns HTTP 401', async ({ request }) => {
    // Attempt to access an API route without JWT/session
    const response = await request.post('http://localhost:3000/api/v1/chat/stream', {
      data: { messages: [] }
    });

    // Check if it returns 401
    expect(response.status()).toBe(401);
  });

  test('SE-03: CSP Header validation (script-src \'self\' without unsafe-inline)', async ({ page }) => {
    // Attempt to access the homepage
    const response = await page.goto('http://localhost:3000/');

    // Assert response is not null
    expect(response).not.toBeNull();
    if (response) {
      // Get the CSP header
      const cspHeader = response.headers()['content-security-policy'];

      // Ensure the header exists
      expect(cspHeader).toBeDefined();

      // Validate CSP contents
      expect(cspHeader).toContain("script-src 'self'");
      expect(cspHeader).not.toContain("unsafe-inline");
    }
  });

});
