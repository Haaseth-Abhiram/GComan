import { test, expect } from '@playwright/test';

// The product → inquiry funnel. Every Get Quote CTA passes ?product=&ref= to
// /contact, which must prefill the quotation (subject + message) — this was
// silently discarded until Aug 2026, which is why 270 product pages produced
// almost no inquiries. These tests pin the whole path.
test.describe('Quote funnel', () => {
  test('contact form prefills from ?product= & ?ref=', async ({ page }) => {
    await page.goto('/contact?product=Calcium%20Carbonate&ref=water-treatment%2Fcalcium-carbonate-water');
    await page.waitForLoadState('networkidle');
    const message = page.locator('textarea#message');
    await expect(message).toHaveValue(/quotation for: Calcium Carbonate/);
    await expect(message).toHaveValue(/gcoman\.com\/products\/water-treatment\/calcium-carbonate-water/);
    await expect(message).toHaveValue(/Quantity required/);
    // subject select shows the quotation option
    await expect(page.locator('form').getByText(/quotation/i).first()).toBeVisible();
  });

  test('malicious ref is not reflected into the message', async ({ page }) => {
    await page.goto('/contact?product=Test&ref=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
    await page.waitForLoadState('networkidle');
    const value = await page.locator('textarea#message').inputValue();
    expect(value).not.toContain('<script>');
    expect(value).toContain('quotation for: Test');
  });

  test('product detail Request-a-Quote carries product + ref', async ({ page }) => {
    await page.goto('/products/water-treatment/calcium-carbonate-water');
    await page.waitForLoadState('networkidle');
    const href = await page.locator('a[href^="/contact?product="]').first().getAttribute('href');
    expect(href).toContain('product=Calcium%20Carbonate');
    expect(href).toContain('ref=water-treatment%2Fcalcium-carbonate-water');
  });

  test('category card Get Quote navigates to prefilled contact', async ({ page }) => {
    await page.goto('/products/water-treatment');
    await page.waitForLoadState('networkidle');
    const btn = page.getByRole('button', { name: 'Get Quote' }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForURL('**/contact?product=*');
    await expect(page.locator('textarea#message')).toHaveValue(/quotation for:/);
  });

  test('card overlay still navigates to the product page (nested-anchor fix)', async ({ page }) => {
    await page.goto('/products/water-treatment');
    await page.waitForLoadState('networkidle');
    // The card body sits under a full-card overlay <a> — clicks anywhere on
    // the card (except the quote button) land on that link by design.
    const overlay = page.locator('a[aria-label="Calcium Carbonate"]').first();
    await overlay.scrollIntoViewIfNeeded();
    await overlay.click();
    await page.waitForURL('**/products/water-treatment/**');
    expect(page.url()).toContain('/products/water-treatment/');
  });

  test('Arabic card shows localized Get Quote and prefills Arabic template', async ({ page }) => {
    await page.goto('/ar/products/water-treatment');
    await page.waitForLoadState('networkidle');
    const btn = page.getByRole('button', { name: 'اطلب عرض سعر' }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForURL('**/ar/contact?product=*');
    await expect(page.locator('textarea#message')).toHaveValue(/عرض سعر/);
  });
});
