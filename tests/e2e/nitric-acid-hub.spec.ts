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
