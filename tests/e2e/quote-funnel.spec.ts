import { test, expect } from '@playwright/test';

// The product → inquiry funnel. Every Get Quote CTA passes ?product=&ref= to
// /contact, which must prefill the quotation (subject + message) — this was
// silently discarded until Aug 2026, which is why 270 product pages produced
// almost no inquiries. These tests pin the whole path.
test.describe('Quote funnel', () => {
  test('contact form prefills from ?product= & ?ref=', async ({ page }) => {
    await page.goto('/contact?product=Calcium%20Carbonate&ref=water-treatment%2Fcalcium-carbonate-water');
    // No networkidle here: /contact embeds a Google Maps iframe whose tile
    // requests keep the network busy, so the page never reliably goes idle.
    // The toHaveValue assertions below auto-wait for the real condition.
    const message = page.locator('textarea#message');
    await expect(message).toHaveValue(/quotation for: Calcium Carbonate/);
    await expect(message).toHaveValue(/gcoman\.com\/products\/water-treatment\/calcium-carbonate-water/);
    await expect(message).toHaveValue(/Quantity required/);
    // subject select shows the quotation option
    await expect(page.locator('form').getByText(/quotation/i).first()).toBeVisible();
  });

  test('malicious ref is not reflected into the message', async ({ page }) => {
    await page.goto('/contact?product=Test&ref=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
    // See above — /contact never reaches networkidle. Wait on the prefill
    // itself, then read the raw value; inputValue() does not auto-wait.
    const message = page.locator('textarea#message');
    await expect(message).toHaveValue(/quotation for: Test/);
    const value = await message.inputValue();
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

  test('quote CTA is never nested inside a link (nested-anchor fix)', async ({ page }) => {
    await page.goto('/products/water-treatment');
    await page.waitForLoadState('networkidle');
    // History: the card was once an <a> wrapping another <a>, which some
    // browsers resolve by dropping the inner link — silently eating quote
    // clicks. The quote CTA must stay a sibling of the card's link, never a
    // descendant of one.
    const quoteBtn = page.getByRole('button', { name: 'Get Quote' }).first();
    await expect(quoteBtn).toBeVisible();
    expect(await quoteBtn.evaluate((el) => Boolean(el.closest('a')))).toBe(false);
  });

  test('card title link navigates to the product page', async ({ page }) => {
    await page.goto('/products/water-treatment');
    await page.waitForLoadState('networkidle');
    // The title is a real <a> (crawlable, middle-clickable) rather than an
    // absolutely-positioned overlay, which used to make the whole card — CAS
    // numbers included — impossible to select or copy.
    // Scoped to the card: the sidebar also carries a "Calcium Carbonate"
    // category link, which points at a different URL.
    const title = page
      .getByRole('button', { name: 'Get Quote' })
      .first()
      .locator('xpath=ancestor::*[contains(@class,"logo-gradient-border")][1]')
      .getByRole('link')
      .first();
    await title.scrollIntoViewIfNeeded();
    await title.click();
    await page.waitForURL('**/products/water-treatment/**');
    expect(page.url()).toContain('/products/water-treatment/');
  });

  test('clicking the card body (not the CTA) opens the product page', async ({ page }) => {
    await page.goto('/products/water-treatment');
    await page.waitForLoadState('networkidle');
    // Whole-card click convenience is now a JS handler rather than an overlay
    // link, so it needs its own guard.
    const card = page
      .getByRole('button', { name: 'Get Quote' })
      .first()
      .locator('xpath=ancestor::*[contains(@class,"logo-gradient-border")][1]');
    await card.scrollIntoViewIfNeeded();
    // Click near the top-left corner, away from the title link and the CTA.
    await card.click({ position: { x: 8, y: 8 } });
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
