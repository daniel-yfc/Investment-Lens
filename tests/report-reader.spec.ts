import { test, expect } from '@playwright/test';

test.describe('ReportReader Component', () => {
  test.beforeEach(async ({ page }) => {
    // Strip CSP header to allow Next.js dev scripts to execute and hydrate the React components
    await page.route('**/*', async route => {
      const response = await route.fetch();
      const headers = response.headers();
      delete headers['content-security-policy'];
      await route.fulfill({
        response,
        headers,
      });
    });

    await page.goto('http://localhost:3000/dashboard/reports/mock-report');
    await page.waitForLoadState('networkidle');
  });

  test('should render meta information correctly', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1', { hasText: 'State of Frontend Engineering 2026' }).first()).toBeVisible();

    // Check subtitle
    await expect(page.getByText('An annual survey of tooling')).toBeVisible();

    // Check author
    await expect(page.locator('article').getByText('A. Nguyen')).toBeVisible();

    // Check date
    await expect(page.locator('article').getByText('March 2026')).toBeVisible();

    // Check tags in the header
    await expect(page.locator('header').getByText('Engineering', { exact: true })).toBeVisible();
    await expect(page.locator('header').getByText('Survey', { exact: true })).toBeVisible();
  });

  test('should render sections with correct levels', async ({ page }) => {
    // Level 1 headings
    await expect(page.locator('h2', { hasText: 'Executive Summary' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Tooling Landscape' })).toBeVisible();

    // Level 2 headings
    await expect(page.locator('h3', { hasText: 'Bundlers & Runtimes' })).toBeVisible();

    // Content
    await expect(page.getByText('Frontend engineering is undergoing its fastest period of change')).toBeVisible();
  });

  test('should toggle sidebar open and close', async ({ page }) => {
    const sidebar = page.locator('aside');
    // Initially w-60
    await expect(sidebar).toHaveClass(/w-60/);

    const toggleBtn = page.getByRole('button', { name: 'Toggle sidebar' });
    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/w-0/);

    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/w-60/);
  });

  test('should highlight active section in sidebar and update progress', async ({ page }) => {
    const summaryBtn = page.locator('aside nav button', { hasText: 'Executive Summary' });
    await expect(summaryBtn).toHaveClass(/text-indigo-600/);

    // Click on the last section to scroll down
    const bundlersBtn = page.locator('aside nav button', { hasText: 'Bundlers & Runtimes' });
    await bundlersBtn.click();

    // Since scroll is smooth, wait for the class to update
    await expect(bundlersBtn).toHaveClass(/text-indigo-600/, { timeout: 10000 });

    // Progress should update to 100% (3/3 sections)
    await expect(page.locator('aside').getByText('100%')).toBeVisible({ timeout: 10000 });
  });

  test('sidebar links should scroll to the correct section', async ({ page }) => {
    const toolingBtn = page.locator('aside nav button', { hasText: 'Tooling Landscape' });

    // Click the button in the sidebar
    await toolingBtn.click();

    // Check if the link becomes active
    await expect(toolingBtn).toHaveClass(/text-indigo-600/, { timeout: 10000 });
  });
});
