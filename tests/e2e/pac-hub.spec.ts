import { test, expect } from '@playwright/test';

// PAC hub (MASTER-PLAN P2.4). Pins the two grade rows, the coagulant
// comparison links, the self canonical and the visible FAQs.
const HUB = '/chemical-supplier/poly-aluminium-chloride-oman';

test.describe('Poly aluminium chloride hub', () => {
  test('links both PAC grades and the alum and ferric comparison rows', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    for (const href of [
      '/products/water-treatment/pac-liquid',
      '/products/water-treatment/pac-powder',
      '/products/water-treatment/aluminium-sulphate-liquid',
      '/products/water-treatment/ferric-chloride-liquid',
    ]) await expect(page.locator(`table a[href="${href}"]`).first()).toHaveCount(1);
  });

  test('self canonical and visible FAQs', async ({ page }) => {
    await page.goto(HUB);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('Should I use PAC liquid or PAC powder?')).toBeVisible();
  });
});
