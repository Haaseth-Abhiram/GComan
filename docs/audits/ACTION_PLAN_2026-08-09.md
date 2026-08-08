# Action Plan — GCC-Wide Ranking Readiness (companion to AUDIT_REPORT_2026-08-09.md)

Effort/impact estimates; "Type" flags whether this is app-code (fixable in this repo), hosting/platform (needs Lovable), content/ops (needs the business), or off-page (needs outreach).

## Critical — fix within 2-4 weeks

| # | Action | Effort | Impact | Type |
|---|---|---|---|---|
| 1 | Get the Lovable CDN's SPA fallback to return a real 404 (not `dist/index.html`) for any unmatched path | Unknown — depends on Lovable platform config | Very high — likely the single biggest indexation lever on the site | Hosting/platform |
| 2 | Reconcile `Develop` ↔ `main` bidirectionally (pull main's Lovable-side changes into Develop, resolve `public/sitemap.xml` conflicts deliberately, then merge forward) | Medium | Enables every other Develop-branch fix below to ship safely | App code + judgment calls |
| 3 | Ship the Arabic noindex-gating fix (`src/components/SEO.tsx` on Develop) to production, post-reconciliation | Low (once #2 is done) | High — corrects ~58 indexable false-Arabic pages | App code |
| 4 | Ship the 3 legacy-redirect fixes already on Develop (`legacyRedirects.ts`), post-reconciliation | Low | Removes confirmed soft-404s, recovers crawl budget | App code |
| 5 | Lazy-mount `ChemistryHero3D` behind idle/intersection observer; replace the 1.6MB `raw.githubusercontent.com` HDRI with a compressed, self-hosted one | Medium | Very high — fixes 7.5s TBT on every product page | App code |
| 6 | Raise the `Cache-Control: no-cache` sitewide header issue directly with Lovable | Low (a support conversation) | Highest CWV lever, but outside app code | Hosting/platform |
| 7 | Give the 14 `Resources.tsx` guides real routes (`/resources/:slug`) so they prerender standalone | Medium | High — unlocks real, already-written content | App code |
| 8 | Decide and execute on SDS/TDS/CoA documents: either genuinely host them or stop implying they're provided in product copy | Medium-High (content/ops) | High — closes the top E-E-A-T gap for a chemical distributor | Content/ops |

## High — fix within 1-2 months

| # | Action | Effort | Impact | Type |
|---|---|---|---|---|
| 9 | Expand FAQ coverage from 25% toward 100%, prioritizing oilfield (47 products), water-treatment (45), lab-chemicals (34) first | High (content) | High — biggest AI-citation and rich-result lever | Content |
| 10 | Add 3-5 real, named or specifically-detailed case studies/testimonials; surface Google review rating on-site once GBP exists | Medium | Very high — the single lowest-scoring dimension across every buyer persona tested | Content |
| 11 | Fix GCC geo-framing: add a scannable "GCC Delivery & Export Coverage" table above the fold on every "...Oman"-titled supplier page | Low-Medium | High for non-Oman GCC buyers | Content |
| 12 | Resolve the ~20 duplicate product-title cannibalization pairs across category JSON files | Medium | Medium-High — prerequisite for any city-page scaling | Content/data |
| 13 | Verify/claim Google Business Profile directly in business.google.com; don't trust the current Maps embed | Low | High for Oman local-pack visibility | Content/ops |
| 14 | Build Jubail and Yanbu (Saudi) city landing pages first, then Ras Laffan (Qatar) | Medium | High — named, high-intent industrial hubs currently misrouted | Content |
| 15 | Add 1 GHS/hazard-data block per product, starting with the highest-hazard SKUs | High (content, needs real technical data) | Medium-High — safety trust signal | Content |
| 16 | Add named brand-partnership badges to `/products/lab-chemicals` (mirroring the existing Shell/Mobil/Castrol pattern already used on lubricants) | Low | Medium — matches explicit "distributor" query intent | Content |
| 17 | Launch the backlink plan: OCCI directory listing, GPCA membership, and the manufacturer-locator ask to Shell/Mobil/Castrol/GP-IPOL (warm ask, existing relationship) | Low-Medium | High — primary lever for position improvement above ~11 | Off-page |

## Medium — fix within 1-2 months

| # | Action | Effort | Impact |
|---|---|---|---|
| 18 | Consolidate `blogArticles.ts` into the live `blogPosts`/`Blog.tsx` system, or explicitly retire it | Medium | Medium — removes content fragmentation |
| 19 | Rebuild `agro.json`'s 8 products with real depth (currently the thinnest category) | Medium | Medium |
| 20 | Split `additives`, `calcium-carbonate`, `lab-equipment` single-SKU pages into real per-product content | Medium | Medium |
| 21 | Fix live NAP postal-code inconsistency (`111` vs `100`) across `index.html` and `ContactPageStructuredData` | Low | Medium |
| 22 | Delete the 3 dead, stale structured-data components (`OrganizationStructuredData`, `LocalBusinessStructuredData`, `WebSiteStructuredData`) | Low | Low now, prevents a future landmine |
| 23 | Reconcile the homepage's two conflicting Service/ItemList schema blocks into one source of truth | Low | Low-Medium |
| 24 | Complete `sameAs` arrays to include all 6 live social profiles | Low | Low |
| 25 | Recompress/resize homepage hero images to target <150KB; convert remaining JPGs/PNG icon to WebP | Low | Medium (LCP) |
| 26 | Add a `blog/meg-vs-deg-gas-dehydration-oman-gcc` redeploy investigation — it's in the repo sitemap but missing from the live one | Low | Low-Medium |
| 27 | Add an indicative price range to the already-scaffolded `Offer.priceRange` schema field instead of leaving pricing fully quote-gated | Low | Medium |
| 28 | Turn the caustic-soda flakes/prills/liquid content into an actual comparison table | Low | Medium |

## Low — backlog

| # | Action | Effort | Impact |
|---|---|---|---|
| 29 | Re-export favicon at proper small size (<5KB) | Trivial | Low |
| 30 | Verify GA/Zoho SalesIQ actually respect consent gating (network evidence suggests pre-consent firing — confirm against `consent.ts`) | Low | Medium if confirmed |
| 31 | Add a 5th decimal to geo coordinates once GBP-verified coordinates exist | Trivial | Low |
| 32 | Refresh sitemap `lastmod` values to reflect real content-change dates | Low | Low |

## Strategic — sequencing for GCC-wide dominance (not a quick fix, a roadmap)

1. **Wave 0:** Fix cannibalization (#12) before scaling anything.
2. **Wave 1 (Oman):** Replicate the caustic-soda product×location page pattern to 3-4 more high-volume products.
3. **Wave 2 (Saudi):** Jubail + Yanbu pages (#14), paired with oilfield/corrosion-inhibitor content.
4. **Wave 3 (UAE):** Target Sharjah/Fujairah with lab-chemicals/RO content rather than competing head-on with entrenched Dubai incumbents.
5. **Wave 4 (Qatar/Kuwait/Bahrain):** Fill remaining hub gaps; build one cross-country desalination/RO content pillar — a structural GCC-wide need no sampled competitor has built.

Realistic framing: don't scope this as "#1 everywhere at once" — scope it as a sequenced campaign against entrenched multi-country incumbents.
