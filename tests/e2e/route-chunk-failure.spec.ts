import { test, expect } from '@playwright/test';

// Pins RouteChunkBoundary (src/components/RouteChunkBoundary.tsx).
//
// GSC live test 2026-10-18: Google's renderer failed to fetch the lab hub's
// route chunk, the app-wide ErrorBoundary swapped the prerendered page for
// "Something went wrong", and Google rejected the indexing request as a Soft
// 404. With the route chunk blocked outright, the prerendered page must stay
// on screen.
//
// Needs prerendered HTML (a full `npm run build` served by
// scripts/serve-dist.mjs, or production via BASE_URL). The dev server and
// build:dev have no prerendered snapshot, so the test skips there.
const PATH = '/chemical-supplier/laboratory-chemicals-oman';

test('a route chunk that cannot load leaves the prerendered page, not the error card', async ({ page, request }) => {
  const raw = await (await request.get(PATH)).text();
  test.skip(!/<h1[^>]*>[^<]*Laborator/i.test(raw), 'no prerendered HTML on this target');

  await page.route(/LaboratoryChemicalsOman[^/]*\.js/, (route) => route.abort());
  await page.goto(PATH);
  // lazyRetry: 3 attempts (~2 s) then one recovery reload, after which it fails again.
  await page.waitForTimeout(6_000);

  await expect(page.locator('h1').first()).toContainText(/Laborator/i);
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
});
