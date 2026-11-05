import { test, expect } from '@playwright/test';

// GCC pool-chlorine hub (PoolChlorineGcc.tsx, MASTER-PLAN P9.9). Pins: title
// and H1 carry the UAE / calcium hypochlorite phrasing from the demand study,
// self canonical, visible FAQ, no link to the canonicalised water-treatment
// chlorine-tablets twin, and the inbound link from the pool category intro.

const HUB = '/chemical-supplier/pool-chlorine-gcc';

test.describe('Pool chlorine GCC hub', () => {
  test('title, H1, canonical and visible FAQ', async ({ page }) => {
    await page.goto(HUB);
    await expect(page.locator('h1')).toHaveText(/^Pool Chlorine and Calcium Hypochlorite Supplier for the UAE/);
    await expect(page).toHaveTitle(/^Pool Chlorine & Calcium Hypochlorite Supplier UAE/);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('Do you supply calcium hypochlorite to the UAE?').first()).toBeVisible();
  });

  test('links canonical SKUs, never the canonicalised tablet twin', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    for (const href of ['/products/swimming-pool/calcium-hypochlorite-granules', '/products/swimming-pool/tcca-tablet-pool', '/chemicals/kuwait-city']) {
      await expect(page.locator(`a[href="${href}"]`).first(), `hub must link ${href}`).toHaveCount(1);
    }
    await expect(page.locator('a[href="/products/water-treatment/chlorine-tablets"]')).toHaveCount(0);
  });

  test('the swimming-pool category page links to it', async ({ page }) => {
    await page.goto('/products/swimming-pool');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`a[href="${HUB}"]`).first()).toHaveCount(1);
  });
});
