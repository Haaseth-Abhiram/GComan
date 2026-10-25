import { test, expect } from '@playwright/test';

// The nitric acid hub is the page we need to rank for "nitric acid supplier in
// oman" (Google's second autocomplete suggestion for "nitric acid" in Oman).
// Keyword research on 2026-10-22 showed bulk buyers searching "nitric acid
// bulk price", "bulk nitric acid suppliers", "wholesale nitric acid" and
// "nitric acid price per ton"; the bulk section and its two FAQs answer those.
// This pins them so a later edit cannot silently drop the bulk offer.
const HUB = '/chemical-supplier/nitric-acid-oman';

test.describe('Nitric acid hub — bulk supply', () => {
  test('bulk section, WhatsApp enquiry and bulk FAQs are on the page', async ({ page }) => {
    await page.goto(HUB);
    await expect(page.getByRole('heading', { name: /Bulk and Wholesale Nitric Acid Supply/i })).toBeVisible();

    const wa = page.locator('#bulk-supply a[href^="https://wa.me/96892772305"]');
    await expect(wa).toHaveCount(1);
    const href = await wa.getAttribute('href');
    expect(decodeURIComponent(href ?? '')).toContain('Bulk nitric acid enquiry');

    await expect(page.getByText('Can you supply nitric acid in bulk?').first()).toBeVisible();
    await expect(page.getByText('What is the bulk price of nitric acid per ton in Oman?').first()).toBeVisible();
  });

  test('FAQPage schema includes the bulk questions', async ({ page }) => {
    await page.goto(HUB);
    // The page carries several JSON-LD blocks (site-wide entity graph from
    // index.html plus Helmet-mounted ones); match the FAQPage that has our
    // questions rather than the first FAQPage found.
    await expect
      .poll(async () => (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n'))
      .toContain('Can you supply nitric acid in bulk?');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = blocks.find((b) => b.includes('"FAQPage"') && b.includes('nitric acid in bulk')) ?? '';
    expect(faq).toContain('Can you supply nitric acid in bulk?');
    expect(faq).toContain('What is the bulk price of nitric acid per ton in Oman?');
  });
});

// The five GCC country pages carry the same bulk offer, prefilled per country
// (2026-10-25: Perplexity named us in four of them, but only for lab volumes).
test.describe('Nitric acid country pages — bulk supply', () => {
  for (const [slug, name] of [
    ['uae', 'UAE'],
    ['saudi-arabia', 'Saudi Arabia'],
    ['qatar', 'Qatar'],
    ['kuwait', 'Kuwait'],
    ['bahrain', 'Bahrain'],
  ] as const) {
    test(`${name}: bulk heading and country-specific WhatsApp enquiry`, async ({ page }) => {
      await page.goto(`/chemical-supplier/nitric-acid-${slug}`);
      await expect(page.getByRole('heading', { name: /Can you supply bulk nitric acid to/i })).toBeVisible();
      const wa = page.locator('#bulk-supply a[href^="https://wa.me/96892772305"]');
      await expect(wa).toHaveCount(1);
      expect(decodeURIComponent((await wa.getAttribute('href')) ?? '')).toContain(`Bulk nitric acid enquiry for ${name}`);
    });
  }
});

// Arabic hub (2026-10-25): a full Arabic body, so the /ar render is indexable
// with its own canonical and reciprocal hreflang — the Arabic SEO model's rule.
test.describe('Nitric acid hub — Arabic', () => {
  test('/ar renders the Arabic body, self-canonical, indexable', async ({ page }) => {
    await page.goto('/ar/chemical-supplier/nitric-acid-oman');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('مورد ومصنّع حمض النيتريك في عُمان');
    await expect(page.getByText('أين يمكن شراء حمض النيتريك في عُمان؟').first()).toBeVisible();
    await expect
      .poll(async () => page.locator('link[rel="canonical"]').last().getAttribute('href'))
      .toBe('https://gcoman.com/ar/chemical-supplier/nitric-acid-oman');
    const robots = await page.locator('meta[name="robots"]').last().getAttribute('content');
    expect(robots ?? '').not.toContain('noindex');
    await expect(page).toHaveTitle(/حمض النيتريك/);
    const wa = page.locator('#bulk-supply ~ * a[href^="https://wa.me/"], main a[href^="https://wa.me/96892772305"]').first();
    expect(decodeURIComponent((await wa.getAttribute('href')) ?? '')).toContain('حمض النيتريك بالجملة');
  });

  test('English hub points to the Arabic twin with hreflang', async ({ page }) => {
    await page.goto('/chemical-supplier/nitric-acid-oman');
    await expect
      .poll(async () => page.locator('link[rel="alternate"][hreflang="ar"]').last().getAttribute('href'))
      .toBe('https://gcoman.com/ar/chemical-supplier/nitric-acid-oman');
  });
});
