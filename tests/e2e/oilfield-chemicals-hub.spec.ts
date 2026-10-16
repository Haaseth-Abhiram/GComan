import { test, expect } from '@playwright/test';
import oilfield from '../../src/data/products/oilfield.json' with { type: 'json' };

// Oilfield chemicals hub (MASTER-PLAN P2.6). Rows are generated from
// oilfield.json and grouped by job; unknown ids fall into "Other", so every
// indexable oilfield product must appear exactly once and canonicalised
// variants must not appear at all.
const HUB = '/chemical-supplier/oilfield-chemicals-oman';
type P = { id: string; details: { canonicalOverride?: string } };
const live = (oilfield as P[]).filter((p) => !p.details.canonicalOverride);
const retired = (oilfield as P[]).filter((p) => p.details.canonicalOverride);

test.describe('Oilfield chemicals hub', () => {
  test('lists every live oilfield product once and no canonicalised variant', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    const hrefs = await page.locator('table a[href^="/products/oilfield/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBe(live.length);
    expect(new Set(hrefs).size).toBe(live.length);
    for (const p of retired) expect(hrefs).not.toContain(`/products/oilfield/${p.id}`);
  });

  test('self canonical and visible FAQs', async ({ page }) => {
    await page.goto(HUB);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('Are you JSRS registered for PDO and other operators?')).toBeVisible();
  });
});
