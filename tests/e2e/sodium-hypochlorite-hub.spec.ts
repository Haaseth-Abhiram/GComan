import { test, expect } from '@playwright/test';

// Sodium hypochlorite hub (MASTER-PLAN P2.5). The grade table is generated
// from four category JSON files; pin that every live grade page is linked and
// that the canonicalised municipal duplicate (sodium-hypochlorite-2) is not.
const HUB = '/chemical-supplier/sodium-hypochlorite-oman';
const GRADES = [
  '/products/water-treatment/sodium-hypochlorite',
  '/products/food-beverage/sodium-hypochlorite-food',
  '/products/soap-detergent/sodium-hypochlorite-12-15-soap',
  '/products/swimming-pool/sodium-hypochlorite-pool',
  '/products/swimming-pool/sodium-hypo-chlorite-12-15',
  '/products/swimming-pool/chlorine-liquid-pool',
];

test.describe('Sodium hypochlorite hub', () => {
  test('links every grade page and not the canonicalised duplicate', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    for (const href of GRADES) await expect(page.locator(`table a[href="${href}"]`)).toHaveCount(1);
    await expect(page.locator('a[href="/products/water-treatment/sodium-hypochlorite-2"]')).toHaveCount(0);
  });

  test('self canonical, visible FAQs, linked back from a grade page', async ({ page }) => {
    await page.goto(HUB);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('What must never be mixed with sodium hypochlorite?')).toBeVisible();
    await page.goto('/products/food-beverage/sodium-hypochlorite-food');
    await expect(page.locator(`a[href="${HUB}"]`).first()).toHaveCount(1);
  });
});
