import { test, expect } from '@playwright/test';

// The dosing calculators are the site's first linkable tool (Sprint 4).
// These tests pin the arithmetic — a silently wrong formula on an
// engineering page is worse than no page.
test.describe('Dosing calculators', () => {
  test('chlorination: 2 mg/L × 500 m³/day @65% cal-hypo ≈ 1.54 kg/day', async ({ page }) => {
    await page.goto('/tools/dosing-calculator');
    await expect(page.locator('h1')).toContainText('Dosing Calculators');
    const result = page.locator('[data-result="chlorination"]');
    await expect(result).toContainText('1.54 kg/day');
    await expect(result).toContainText('46 kg/month');
  });

  test('chlorination reacts to input change (1000 m³/day → 3.08 kg/day)', async ({ page }) => {
    await page.goto('/tools/dosing-calculator');
    await page.fill('#cl-flow', '1000');
    await expect(page.locator('[data-result="chlorination"]')).toContainText('3.08 kg/day');
  });

  test('glycol: -15°C target on 5000 L MEG system → 40% = 2,000 L glycol', async ({ page }) => {
    await page.goto('/tools/dosing-calculator');
    // The default target must be one of the select's options, or the
    // trigger renders blank (Radix shows nothing for an unmatched value).
    await expect(page.locator('[data-calc="glycol"] button[role="combobox"]').nth(1)).toContainText('-15 °C');
    const result = page.locator('[data-result="glycol"]');
    await expect(result).toContainText('40% v/v');
    await expect(result).toContainText('2,000 L glycol');
  });

  test('cooling tower: 500 m³/h, ΔT 6, C=5 → E≈4.59, B≈1.15', async ({ page }) => {
    await page.goto('/tools/dosing-calculator');
    const result = page.locator('[data-result="tower"]');
    await expect(result).toContainText('4.59 m³/h');
    await expect(result).toContainText('1.15 m³/h');
  });

  test('RO: 100 m³/h @3 mg/L → 300 g/h, 7.2 kg/day', async ({ page }) => {
    await page.goto('/tools/dosing-calculator');
    const result = page.locator('[data-result="ro"]');
    await expect(result).toContainText('300 g/h');
    await expect(result).toContainText('7.2 kg/day');
  });

  test('quote CTAs feed the prefilled contact funnel', async ({ page }) => {
    await page.goto('/tools/dosing-calculator');
    const href = await page.locator('[data-calc="chlorination"] a[href^="/contact?product="]').getAttribute('href');
    expect(href).toContain('product=Calcium%20Hypochlorite');
    await page.locator('[data-calc="ro"] a[href^="/contact?product="]').click();
    await page.waitForURL('**/contact?product=*');
    await expect(page.locator('textarea#message')).toHaveValue(/Antiscalant RO/);
  });

  test('footer links the calculator sitewide', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('footer a[href="/tools/dosing-calculator"]')).toHaveCount(1);
  });
});
