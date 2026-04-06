import { test, expect } from '@playwright/test';

test.describe('API Integration tests for /api/v1/chat/stream', () => {

  test('TC-031: Missing JWT returns 401', async ({ request }) => {
    const res = await request.post('http://localhost:3000/api/v1/chat/stream', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: { message: '分析台積電' }
    });

    expect(res.status()).toBe(401);
  });

  test('TC-030: Normal response contains text/event-stream Content-Type', async ({ request }) => {
    const res = await request.post('http://localhost:3000/api/v1/chat/stream', {
      headers: {
        'Content-Type': 'application/json',
        'x-playwright-test': 'true',
        'x-test-auth': 'true'
      },
      data: { message: '分析台積電 2330.TW', conversationId: null }
    });

    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/event-stream');
  });

  test('TC-032: Rate Limit Exceeded returns 429', async ({ request }) => {
    // Fire off 21 requests to hit the rate limit
    const promises = Array.from({ length: 21 }, (_, i) =>
      request.post('http://localhost:3000/api/v1/chat/stream', {
        headers: {
          'Content-Type': 'application/json',
          'x-playwright-test': 'true',
          'x-test-auth': 'true',
          'x-forwarded-for': 'rate-limit-test-ip-3'
        },
        data: { message: 'rate limit test ' + i }
      })
    );

    const responses = await Promise.all(promises);
    const hasRateLimited = responses.some(res => res.status() === 429);
    expect(hasRateLimited).toBeTruthy();
  });
});
