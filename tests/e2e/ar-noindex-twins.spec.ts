import { test, expect } from '@playwright/test';

// Noindex /ar twins (vite.config.ts routesFromSitemap, 2026-11-13): /ar pages
// without Arabic meta are not in the sitemap, so they used to ship the SPA
// shell to crawlers that do not run JavaScript (homepage title, `index,
// follow`, canonical "/"). They are now prerendered with their own noindex and
// canonical. Only meaningful against a deploy (BASE_URL): the dev server and
// PROD_BUILD mode (build:dev, which skips the prerenderer) have no such HTML.
test.describe('Noindex /ar twins ship their own head in raw HTML (built site only)', () => {
  test.skip(!process.env.BASE_URL, 'prerendered HTML exists only in a full build / deploy');

  for (const route of ['/ar/products/lubricants', '/ar/about', '/ar/blog/caustic-soda-supplier-oman']) {
    test(route, async ({ request }) => {
      const res = await request.get(route);
      const html = await res.text();
      expect(html).toMatch(/<meta name="robots" content="noindex, follow"/);
      expect(html).toContain(`<link rel="canonical" href="https://gcoman.com${route}"`);
      expect(html).not.toContain('<link rel="canonical" href="https://gcoman.com/"');
    });
  }

  // Footer legal pages (NOINDEX_PRERENDER_ROUTES, 2026-11-13): <SEO noIndex>,
  // which renders `noindex, nofollow` and the page's own canonical.
  for (const route of ['/privacy', '/terms', '/ar/privacy', '/ar/terms']) {
    test(route, async ({ request }) => {
      const html = await (await request.get(route)).text();
      expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/);
      expect(html).toContain(`<link rel="canonical" href="https://gcoman.com${route}"`);
    });
  }
});
