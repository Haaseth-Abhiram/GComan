// Client-side legacy-URL redirects — the layer that actually runs in production.
//
// The live site is served by Lovable's CDN (DNS A record 185.158.133.1 is
// Lovable's ingress), which supports no server-side redirects, so the old
// WordPress-era URLs must be redirected inside the app. <LegacyRedirectHandler>
// in src/App.tsx consults this module on every location change.
//
// Ported from the retired cloudflare-worker.js maps; public/_redirects and
// public/.htaccess mirror these rules for a potential future move to
// self-hosted Apache. When adding a redirect, update all three.

const EXACT_REDIRECTS = new Map<string, string>([
  // Old /products/acids/* → new categories
  ['/products/acids/citric-acid', '/products/water-treatment/citric-acid-anhydrous'],
  ['/products/acids/acetic-acid', '/products/oilfield/acetic-acid'],
  ['/products/acids/nitric-acid', '/products/lab-chemicals/nitric-acid-lab'],
  ['/products/acids/phosphoric-acid', '/products/lab-chemicals/phosphoric-acid-lab'],
  ['/products/acids/hydrochloric-acid', '/products/lab-chemicals/hydrochloric-acid-lab'],
  ['/products/acids/sulfuric-acid', '/products/lab-chemicals/sulfuric-acid-lab'],

  // Old /products/alkalis/*
  ['/products/alkalis/caustic-soda', '/products/water-treatment/caustic-soda-flakes'],
  ['/products/alkalis/caustic-potash', '/products/water-treatment/potassium-hydroxide-water'],
  ['/products/alkalis/sodium-carbonate', '/products/water-treatment/soda-ash-water'],
  ['/products/alkalis/ammonia-solution', '/products/lab-chemicals/ammonia-solution-lab'],

  // Old /products/salts/*
  ['/products/salts/calcium-chloride', '/products/water-treatment/calcium-chloride-water'],
  ['/products/salts/sodium-chloride', '/products/lab-chemicals/sodium-chloride-lab'],
  ['/products/salts/magnesium-sulphate', '/products/lab-chemicals/magnesium-sulfate-lab'],
  ['/products/salts/sodium-sulphate', '/products'],

  // Old /products/oxidizers/*
  ['/products/oxidizers/hydrogen-peroxide', '/products/soap-detergent/hydrogen-peroxide-35'],
  ['/products/oxidizers/sodium-hypochlorite', '/products/water-treatment/sodium-hypochlorite'],

  // Old /products/solvents/* (renamed or moved)
  ['/products/solvents/methanol', '/products/alcohols/methanol-industrial'],
  ['/products/solvents/toluene', '/products/lab-chemicals/toluene-lab'],
  ['/products/solvents/xylene', '/products/lab-chemicals/xylene-lab'],
  ['/products/solvents/mek', '/products/solvents/mek-solvent'],
  ['/products/solvents/acetone', '/products/lab-chemicals/acetone-lab'],

  // Old /products/glycols/* (renamed slugs)
  ['/products/glycols/mono-ethylene-glycol', '/products/glycols/meg-ethylene-glycol'],
  ['/products/glycols/monoethylene-glycol', '/products/glycols/meg-ethylene-glycol'],
  ['/products/glycols/diethylene-glycol', '/products/water-treatment/deg-water'],
  ['/products/glycols/meg', '/products/glycols/meg-ethylene-glycol'],
  ['/products/glycols/deg', '/products/water-treatment/deg-water'],

  // Old /products/alcohols/* (renamed slugs)
  ['/products/alcohols/ethanol', '/products/alcohols/ethanol-industrial'],
  ['/products/alcohols/isopropanol', '/products/alcohols/isopropanol-industrial'],
  ['/products/alcohols/methanol', '/products/alcohols/methanol-industrial'],
  ['/products/alcohols/butanol', '/products/alcohols/butanol-industrial'],

  // Wrong slug in soap-detergent (sitemap corrected to add suffix)
  ['/products/soap-detergent/perchloroethylene', '/products/soap-detergent/perchloroethylene-soap-detergent'],

  // Old top-level category pages that no longer exist
  ['/products/acids', '/products'],
  ['/products/alkalis', '/products'],
  ['/products/salts', '/products'],
  ['/products/oxidizers', '/products'],
  ['/products/oil-gas', '/products/oilfield'],
  ['/products/cleaning-products', '/products'],

  // Legacy WordPress service pages
  ['/service/calcium-carbonate', '/products/water-treatment/calcium-carbonate-water'],
  ['/service/soap-detergent-chemicals', '/products'],
  ['/service/solvents', '/products'],
  ['/service/chlorinated-solvents', '/products'],
  ['/service/construction-chemicals', '/products'],
  ['/service/swimming-1', '/products/swimming-pool'],
  ['/service/swimming', '/products/swimming-pool'],
  ['/service/lubricants-greases', '/products/lubricants'],
  ['/service/lubricants-greases-1', '/products/lubricants'],
  ['/service/laboratories', '/products/lab-chemicals'],
  ['/service/construction', '/products'],
  ['/service/construction-1', '/products'],
  ['/service/inorganic-chemicals', '/products'],
  ['/service/container', '/products'],
  ['/service/food-beverage', '/industries'],
  ['/service/personal-care', '/industries'],
  ['/service/water-treatment-2', '/products/water-treatment'],
  ['/service/water-treatment', '/products/water-treatment'],
  ['/service/automotive-2', '/industries'],
  ['/service/air-chemical', '/products'],
  ['/service/services/oxide', '/products'],
  ['/service/ethanolamines', '/products'],
  ['/service/pharmaceutical', '/industries'],
  ['/service/agriculture', '/industries'],
  ['/service/oil-gas-1', '/products/oilfield'],
  ['/service/general-inquiry', '/contact'],

  // Legacy WordPress category/tag/author pages
  ['/service-category/chlorinated-solvents', '/products'],
  ['/service-category/oilgas', '/products/oilfield'],
  ['/service-category/lab-equipment', '/products/lab-chemicals'],
  ['/service-category/soap-detergent-chemicals', '/products'],
  ['/category/fashion-retail', '/industries'],
  ['/category/news-analysis', '/blog'],
  ['/category/industry-insight', '/blog'],
  ['/category/uncategorized', '/blog'],
  ['/category/lab-equipment', '/products/lab-chemicals'],
  ['/tag/silk', '/blog'],
  ['/tag/cotton', '/blog'],
  ['/author/samplework1', '/blog'],

  // Legacy WordPress product/industry pages
  ['/water-waste-water-treatment-chemicals', '/products/water-treatment'],
  ['/swimming-pool-chemicals', '/products/swimming-pool'],
  ['/lubricants-greases', '/products/lubricants'],
  ['/oilfield-refinery', '/products/oilfield'],
  ['/glycols', '/products'],
  ['/alcohols', '/products'],
  ['/food-beverages', '/industries'],
  ['/industries-2', '/industries'],
  ['/pharmaceutical', '/industries'],
  ['/manufacturing', '/industries'],
  ['/refinery', '/products/oilfield'],
  ['/product/food-beverages', '/products'],
  ['/products-services', '/products'],

  // Legacy company/support pages
  ['/sales-and-comprehensive-support', '/contact'],
  ['/technical-support', '/contact'],
  ['/company', '/about'],
  ['/our-team', '/about'],
  ['/partners', '/about'],
  ['/our-values', '/about'],
  ['/why-choose-us', '/about'],
  ['/team-member/james-logan', '/about'],
  ['/team-member/michal-wincent', '/about'],
  ['/team-member/john-tyler', '/about'],
  ['/service-openings', '/career'],
  ['/jobs/sales-manager', '/career'],
  ['/what-we-supply-2', '/products'],
  ['/terms-conditions', '/terms'],
  ['/privacy-policy', '/privacy'],
  ['/blog-news', '/blog'],
  ['/whats-new', '/blog'],

  // Blog posts with date-based URLs
  ['/2021/03/09/the-story-of-a-silk-lends-cotton-like-comfort', '/blog'],
  ['/2021/02/28/laundry-chemical', '/blog'],
  ['/2021/02/15/textilegence-magazine-digital-platform', '/blog'],
  ['/2021/02/11/contactless-payments-time-has-come', '/blog'],
  ['/2025/10/15/nonwovens-industry-magazine', '/blog'],

  // Malformed URLs with domain in path
  ['/gcoman.com/ethanolamines', '/products'],
  ['/gcoman.com/blog', '/blog'],
]);

// Wildcard prefixes — checked after exact-match fails. Catches the long tail
// of WordPress-era URLs (any date archive, category, tag, author, team page).
const PREFIX_REDIRECTS: Array<[string, string]> = [
  ['/products/acids/', '/products'],
  ['/products/alkalis/', '/products'],
  ['/products/salts/', '/products'],
  ['/products/oxidizers/', '/products'],
  ['/2021/', '/blog'],
  ['/2025/', '/blog'],
  ['/category/', '/blog'],
  ['/tag/', '/blog'],
  ['/author/', '/blog'],
  ['/team-member/', '/about'],
];

/**
 * Returns the destination path for a legacy URL, or null when the path is not
 * a legacy URL. Trailing slashes are ignored for matching; a non-legacy path
 * that only differs by a trailing slash resolves to its canonical no-slash
 * form so /career/ normalizes to /career.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  const exact = EXACT_REDIRECTS.get(normalized);
  if (exact) return exact;

  for (const [prefix, dest] of PREFIX_REDIRECTS) {
    if (normalized.startsWith(prefix) || normalized + '/' === prefix) return dest;
  }

  // Not legacy — but normalize a trailing slash (canonical URLs have none).
  if (normalized !== pathname) return normalized;

  return null;
}
