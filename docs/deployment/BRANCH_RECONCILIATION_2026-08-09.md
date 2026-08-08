# Develop ↔ main Reconciliation — Scope Assessment (prepared for review, not executed)

**Status: NOT executed.** This document exists to show what a `Develop ↔ main` reconciliation actually involves before anyone commits to it — per this repo's branch workflow, merges into `main` are the user's call after their own QA, the same way the one prior reconciliation (`ce2c996`, July 7) was done deliberately rather than as a blind merge.

## The scale, in one number

**120 files differ, ~21,000 lines added / ~17,000 lines removed** between `Develop` and `origin/main`. `Develop` has 27 commits `main` doesn't have (all this session's SEO/perf fixes plus everything since the July 7 reconciliation); `main` has 116 commits `Develop` doesn't have (Lovable's own auto-editor, continuously, through Aug 5).

This is not a fast-forward and not a small conflict-resolution pass — it's comparable in size to the July reconciliation, which took deliberate "kept X from main, kept Y from Develop" decisions across 46 commits. Budget for this accordingly; it is not a 10-minute merge.

## What's genuinely new on `main` that `Develop` would need to absorb (not just overwrite)

These are **real features/fixes**, not just Lovable noise — losing them in a careless merge would be a regression, not a cleanup:

- **`src/pages/OAuthConsent.tsx` (new, 147 lines) + `Login.tsx` (145 lines changed)** — looks like an actual auth/OAuth flow addition. Needs investigation before any merge touches auth code.
- **`src/components/admin/SearchConsoleDashboard.tsx`, `LanguageSeoComparison.tsx`, `ArabicIndexingMonitor.tsx` (new, ~780 lines combined) + `supabase/functions/search-console/index.ts` (new) + `supabase/functions/check-ar-indexing/index.ts` (new)** — a real GSC integration built directly into the admin dashboard. Not in `Develop` at all.
- **`src/pages/Blog.tsx` (+432 lines)** — substantial blog content/feature additions.
- **`src/pages/Products.tsx` (+200 lines changed)** — category page logic changes, per the earlier July reconciliation notes ("agro category SEO + category FAQ overrides").
- **`public/sitemap.xml`** — as already established this session, main's deployed sitemap has fuller Arabic product hreflang coverage (270/270) than Develop's copy (249/270 at last check). Do not let Develop's copy silently win a merge.
- **`index.html` (149 lines changed), `public/robots.txt` (47 lines changed)** — need line-by-line review, not a blind take-main or take-develop.
- **Build tooling**: `package-lock.json` is **deleted** on `main` (13,104 lines) and `bun.lock`/`eslint.config.js`/`vite.config.ts` all differ — main's build pipeline may have moved away from npm-lockfile-based installs. This needs to be understood, not merged mechanically, or CI/local dev could break.

## What's on `Develop` that should reach production (the actual payoff for doing this)

- `src/lib/legacyRedirects.ts` — doesn't exist on `main` at all. Fixes the confirmed-live soft-404s.
- `src/components/SEO.tsx` — Arabic noindex-by-default gating. `main`'s version has no such gating at all (confirmed via code diff earlier this session).
- This session's 6 commits: sitemap hreflang fix, dead schema cleanup, homepage Service/ItemList conflict fix, the 3D hero performance fix (7.5s TBT), and the WebP image conversions.
- The Cloudflare/wrangler retirement (`9cc6ede`).

## Binary asset conflicts (mechanical, low-risk)

This session replaced 4 raster images with WebP versions and added a self-hosted HDRI (`public/hdri/`). `main` still has the original `.jpg`/`.png` files and doesn't have the HDRI. These are easy to resolve in Develop's favor **once it's confirmed `main` hasn't independently modified the same source images** — not verified in this pass.

## Recommended approach (mirrors how `ce2c996` was actually done)

1. Do **not** attempt a single blind `git merge`. Pull `main`'s changes into a working branch first and go through them deliberately, file group by file group (auth, admin/GSC dashboard, sitemap, build tooling, everything else).
2. Treat the "genuinely new on main" list above as **must-review-before-merge**, not "safe to overwrite."
3. Once reconciled, the result should become the new `Develop`, matching the July 7 pattern — then `Develop → main` when the user is ready to promote.
4. This is a big enough task to warrant its own dedicated session rather than folding it into a general SEO pass.

**No branch or production state was changed in preparing this document.**
