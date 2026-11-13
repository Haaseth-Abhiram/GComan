import { test, expect } from '@playwright/test';

// details.countryGuides (ProductDetail.tsx, 2026-11-13): the 11 GCC country
// supply pages had zero links from their own product pages. These pin one
// product per country-page family, and that the row stays off /ar pages
// (no /ar twin exists for any country page yet).
test.describe('Product pages link their GCC country supply pages', () => {
  for (const [product, targets] of [
    ['/products/swimming-pool/calcium-hypochlorite-granules', ['/chemical-supplier/calcium-hypochlorite-uae', '/chemical-supplier/calcium-hypochlorite-bahrain']],
    ['/products/water-treatment/caustic-soda-flakes', ['/chemical-supplier/caustic-soda-uae', '/chemical-supplier/caustic-soda-saudi-arabia']],
    ['/products/water-treatment/hydrochloric-acid-industrial', ['/chemical-supplier/hydrochloric-acid-uae', '/chemical-supplier/hydrochloric-acid-saudi-arabia']],
    ['/products/food-beverage/nitric-acid-68', ['/chemical-supplier/nitric-acid-saudi-arabia', '/chemical-supplier/nitric-acid-uae', '/chemical-supplier/nitric-acid-qatar', '/chemical-supplier/nitric-acid-kuwait', '/chemical-supplier/nitric-acid-bahrain']],
  ] as const) {
    test(`${product} links ${targets.length} country pages`, async ({ page }) => {
      await page.goto(product);
      const nav = page.locator('nav[aria-label="GCC country supply pages"]');
      for (const href of targets) {
        await expect(nav.locator(`a[href="${href}"]`)).toHaveCount(1);
      }
    });
  }

  test('the row is not rendered on the Arabic product page', async ({ page }) => {
    await page.goto('/ar/products/swimming-pool/calcium-hypochlorite-granules');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('nav[aria-label="GCC country supply pages"]')).toHaveCount(0);
  });
});
