import { test, expect } from '@playwright/test';

// Guards for the lazy Arabic bundle split (i18n/index.ts loadFullArabic):
// the SEO-critical subset must stay synchronous while bodies load lazily.
test.describe('Lazy Arabic bundle', () => {
  test('ENGLISH product page still emits hreflang (gate reads eager ar-meta)', async ({ page }) => {
    await page.goto('/products/water-treatment/calcium-carbonate-water');
    await page.waitForLoadState('networkidle');
    const ar = page.locator('link[rel="alternate"][hreflang="ar"]');
    await expect(ar).toHaveAttribute('href', 'https://gcoman.com/ar/products/water-treatment/calcium-carbonate-water');
  });

  test('ENGLISH location page still emits hreflang', async ({ page }) => {
    await page.goto('/chemicals/dubai');
    await page.waitForLoadState('networkidle');
    const ar = page.locator('link[rel="alternate"][hreflang="ar"]');
    await expect(ar).toHaveAttribute('href', 'https://gcoman.com/ar/chemicals/dubai');
  });

  test('AR product page loads full bundle: Arabic longDescription appears', async ({ page }) => {
    await page.goto('/ar/products/water-treatment/calcium-carbonate-water');
    // "مورد" appears in every longDescription; the eager subset has only title/description
    await expect(page.locator('main')).toContainText(/مورّد|مورد/, { timeout: 10000 });
    const title = await page.title();
    expect(title).toMatch(/[؀-ۿ]/);
  });

  test('AR location page renders Arabic body (Saudi translated city)', async ({ page }) => {
    await page.goto('/ar/chemicals/jeddah');
    await expect(page.locator('h1')).toContainText(/[؀-ۿ]/, { timeout: 10000 });
    const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
    expect(robots).not.toContain('noindex');
  });

  test('untranslated AR page stays noindex (gate did not loosen)', async ({ page }) => {
    // cairo: Egypt pages have no Arabic translation; the Oman + GCC pages are
    // all translated now, so they can no longer serve as the noindex fixture.
    await page.goto('/ar/chemicals/cairo');
    await page.waitForLoadState('networkidle');
    const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
    expect(robots).toContain('noindex');
  });
});
