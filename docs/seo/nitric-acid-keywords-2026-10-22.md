# Nitric acid: how buyers search, and what the hub now answers. 2026-10-22

Sources, all read 2026-10-22: Google autocomplete (`suggestqueries`, gl=om, en + ar), Search Console 90 days (pages `*nitric`, by query), Bing Webmaster Keyword Research (Oman, 3 months). Positions are in `location-ledger.md` (nitric re-check, same day).

## Buyer phrasing (Google autocomplete, Oman)

| Seed | What buyers type next |
|---|---|
| nitric acid | **nitric acid supplier in oman** (2nd suggestion), price, sds, for sale, uses, density |
| nitric acid supplier | in oman, near me, in uae, in saudi arabia |
| nitric acid bulk | bulk price, bulk storage, wholesale price, bulk nitric acid suppliers |
| nitric acid price | per kg, per litre, 1 litre, per ton, in uae, in saudi arabia |
| nitric acid 68 | price, msds/sds, density, specific gravity, manufacturer |
| buy nitric acid | online, locally, "can you buy nitric acid", for gold testing |
| nitric acid uae / saudi | price in uae, manufacturers in uae / saudi arabia, "is nitric acid illegal", "is it legal to buy" |
| حمض النيتريك / حمض النتريك | للبيع (for sale), المركز (concentrated), الزراعي (agricultural), اين يوجد (where to find) |

## Demand and our current visibility

| Measure | Reading |
|---|---|
| Bing impressions, "nitric acid", Oman, 3 months | **15** (US 6.2K, UK 1.5K, India 1.3K) — a small, high-value B2B market |
| GSC 90d queries reaching our nitric pages | almost all **"nitric acid food grade"** (43 impr, pos 3.2); "nitric acid supplier" 1 impr at 33; no bulk, price or Oman-supplier query |
| GSC 28d, nitric pages, Oman | **0 impressions** |

## Gap the hub had (live page, 1,907 words)

"price" 0 mentions, "wholesale" 0, "for sale" 0, "minimum order" 0, WhatsApp 0; "bulk" only in pack lists.

## Done on Develop (`49e414b`, waits on Publish)

- Section **"Bulk and Wholesale Nitric Acid Supply"**: who buys in bulk, IBC and bulk-tanker formats, UN 2031 transport documents, what to send for a per-tonne price, 24-hour quote.
- **WhatsApp bulk enquiry** button with a prefilled RFQ (grade, monthly tonnes, pack, delivery point, company).
- FAQs **"Can you supply nitric acid in bulk?"** and **"What is the bulk price of nitric acid per ton in Oman?"** (visible + FAQPage schema), pinned by `tests/e2e/nitric-acid-hub.spec.ts`.

## Not done, needs the user

1. **Price**: buyers search "price per kg / per litre / per ton". An indicative "from OMR … per tonne, IBC" line would match it; only the user can decide to publish a number.
2. **Who can buy / legality**: "is nitric acid illegal / is it legal to buy" appears for UAE and Saudi. A one-line statement of who we sell to (registered companies? end-use declaration?) is needed before answering it.
3. **Arabic hub**: Arabic searchers use "حمض النيتريك للبيع" and "الزراعي". The hub has no Arabic version; building one is a larger piece of work for a decision.
4. Off-site levers unchanged: the four page-1 directories, reviews, a real product photo for the GBP product.
