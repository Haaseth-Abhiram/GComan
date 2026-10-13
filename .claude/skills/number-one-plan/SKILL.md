---
name: number-one-plan
description: Use when the user says "continue the Number One plan", "next step of the plan", "what should I call next", or asks to keep implementing the ranking plan for gcoman.com — resumes docs/seo/MASTER-PLAN.md systematically, one verified item at a time
---

# Number One plan — resume protocol

The plan is `docs/seo/MASTER-PLAN.md`. Do not invent a new one. Do not re-derive the diagnosis (it is in `docs/seo/product-visibility-investigation-2026-10-13.md` and `product-roadmap-2026-10-13.md`).

## Steps, every time

1. Read `docs/seo/MASTER-PLAN.md`. Note **Next up** and the first `open` / `in progress` item in each phase.
2. Check the live state of that item before doing anything (Search Console, the live site, the ledger). An item the user says is done is verified, not assumed.
3. Do the item. Code → Develop, gates green (`npx tsc -b && npm run lint && npm run verify:sitemap-health && npm run verify:ar-meta && npm run verify:serp-titles && npm run test:e2e`), one commit per item, pushed. Browser actions through the signed-in Chrome (owner account `globalchemicalsllc8@gmail.com`).
4. Update the item's status in `MASTER-PLAN.md`, add a line to the session log, append the evidence to `docs/seo/visibility-ledger.md`. Commit.
5. If the item needs the user (Publish, an account, a price, a decision), stop at that item, say exactly what to do and what to say to resume, then continue with the next item that does not depend on it.
6. End the reply with: what was done, what is verified, and **"Next call:"** followed by the exact phrase the user should say next (for example "Publish done — continue the Number One plan", or "continue the Number One plan: P2.1 lab chemicals hub, grades are AR and HPLC in 500 mL and 2.5 L").

## Hard limits

Never: create accounts, sign in, submit directory forms, post reviews, publish to production without the user's explicit in-session instruction, bulk-generate FAQs, retitle the 277 products, build product × city pages, or touch the homepage or JSRS blog.

## Monthly (Phase 6)

Run `monitoring-search-visibility` in `full` mode plus the product panel, compare with the targets table, and add new rows to the phase they belong to.
