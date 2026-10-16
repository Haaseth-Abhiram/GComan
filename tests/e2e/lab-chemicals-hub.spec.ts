import { test, expect } from '@playwright/test';
import labProducts from '../../src/data/products/lab-chemicals.json' with { type: 'json' };

// Lab chemicals hub (MASTER-PLAN P2.1). The reagent table is generated from
// lab-chemicals.json, so these guards pin the two ways it could silently rot:
// a product dropping out of the table, or the table linking to a page that
// canonicalises elsewhere. Also pins the self canonical, the visible FAQs that
// back the FAQPage schema, and the internal links that keep it from shipping
// orphaned (the nitric hub's first-week problem).

const HUB = '/chemical-supplier/laboratory-chemicals-oman';
type P = { id: string; details: { canonicalOverride?: string } };
const indexable = (labProducts as P[]).filter((p) => !p.details.canonicalOverride);

test.describe('Laboratory chemicals hub', () => {
  test('table lists every indexable lab reagent and nothing else', async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState('networkidle');
    const hrefs = await page.locator('table a[href^="/products/lab-chemicals/"]').evaluateAll(
      (as) => as.map((a) => a.getAttribute('href')),
    );
    expect(new Set(hrefs).size).toBe(indexable.length);
    for (const p of indexable) expect(hrefs).toContain(`/products/lab-chemicals/${p.id}`);
  });

  test('self canonical, visible FAQs and an inbound link from a location page', async ({ page }) => {
    await page.goto(HUB);
    const canonical = await page.locator('head link[rel="canonical"]').first().getAttribute('href');
    expect(canonical).toBe(`https://gcoman.com${HUB}`);
    await expect(page.getByText('Which laboratory chemicals do you stock in Oman?')).toBeVisible();

    await page.goto('/chemicals/muscat');
    await expect(page.locator(`a[href="${HUB}"]`).first()).toHaveCount(1);
  });
});
