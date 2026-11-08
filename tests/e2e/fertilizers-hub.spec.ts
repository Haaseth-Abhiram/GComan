import { test, expect } from '@playwright/test';
import labProducts from '../../src/data/products/agro.json' with { type: 'json' };

// Lab chemicals hub (MASTER-PLAN P2.1). The reagent table is generated from
// agro.json, so these guards pin the two ways it could silently rot:
// a product dropping out of the table, or the table linking to a page that
// canonicalises elsewhere. Also pins the self canonical, the visible FAQs that
// back the FAQPage schema, and the internal links that keep it from shipping
// orphaned (the nitric hub's first-week problem).

const HUB = '/chemical-supplier/fertilizers-oman';
type P = { id: string; details: { canonicalOverride?: string } };
const indexable = (labProducts as P[]).filter((p) => !p.details.canonicalOverride);

test.describe('Fertilizer hub', () => {
  test('table lists every indexable fertilizer and nothing else', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    const hrefs = await page.locator('table a[href^="/products/agro/"]').evaluateAll(
      (as) => as.map((a) => a.getAttribute('href')),
    );
    expect(new Set(hrefs).size).toBe(indexable.length);
    for (const p of indexable) expect(hrefs).toContain(`/products/agro/${p.id}`);
  });

  test('self canonical, visible FAQs and an inbound link from a location page', async ({ page }) => {
    await page.goto(HUB);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('Where can I buy urea, DAP and potash fertilizer in Oman?')).toBeVisible();

    await page.goto('/chemicals/muscat');
    await expect(page.locator(`a[href="${HUB}"]`).first()).toHaveCount(1);
  });
});

// P9.6 (2026-11-08): the /ar render is a full Arabic body led by a urea
// section, indexable through hub-pages-ar.json. Pins the Arabic H1 and visible
// urea FAQ, the self canonical, reciprocal hreflang, and that the product
// table links the indexable /ar product twins.
test.describe('Fertilizer hub — Arabic', () => {
  test('/ar renders the Arabic body, is indexable, and both versions carry hreflang', async ({ page }) => {
    await page.goto(`/ar${HUB}`);
    await expect(page.locator('h1')).toContainText('مورد الأسمدة في عُمان');
    await expect(page.getByText('أين أجد يوريا للبيع في عُمان؟').first()).toBeVisible();
    const robots = await page.locator('head meta[name="robots"]').first().getAttribute('content');
    expect(robots ?? '').not.toContain('noindex');
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com/ar${HUB}`);
    await expect(page.locator('head link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('table a[href="/ar/products/agro/urea-fertilizer"]')).toHaveCount(1);

    await page.goto(HUB);
    await expect(page.locator('head link[rel="alternate"][hreflang="ar"]')).toHaveCount(1);
  });
});
