# Product images — sourcing & licenses

These are **category/packaging-representative** stock images, not unique photography
of each individual product. Free stock photography of a specific named industrial
chemical (e.g. "Sodium Bisulphate 98% technical grade") doesn't exist — these images
instead represent the physical form/packaging most products in a category ship in
(liquid in an IBC tote, powder, drums, granules, lab reagent bottles, etc.), mapped
per-product in `src/data/products/*.json` (`image` field). See
`src/pages/ProductDetail.tsx` / `src/components/StructuredData.tsx` for how the field
is consumed.

Every file below was verified individually for license terms before downloading —
no scraping of unknown-license images. All are either public domain, CC0, Pexels'
free-to-use license, or Creative Commons attribution licenses (attribution not
legally required for this use, but the original source is recorded here for
provenance/audit purposes).

All images were resized to 1200×900 and re-encoded as WebP (quality 78) via `sharp`;
originals are not kept in the repo.

| File | Source | License | Attribution |
|---|---|---|---|
| `liquid-ibc-tank.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Intermediate_Bulk_Container_(fcm).jpg) | CC BY-SA 4.0 | fcm |
| `chemical-drums.webp` | [Pexels photo 615670](https://www.pexels.com/photo/high-angle-photograph-of-blue-metal-barrels-615670/) | Pexels License (free to use, no attribution required) | Conrad Marshall |
| `white-powder.webp` | [Pexels photo 36346846](https://www.pexels.com/photo/close-up-view-of-white-powder-texture-36346846/) | Pexels License | — |
| `food-grade-powder.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sodium_bicarbonate.jpg) | Public domain | — |
| `granules-fertilizer.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DAP_(Diammonium_Phosphate)_Granules_(1).jpg) | CC BY-SA 4.0 | — |
| `granules-flakes.webp` | [Pexels photo 10187647](https://www.pexels.com/photo/directly-above-view-of-petri-dish-10187647/) | Pexels License | — |
| `lab-reagent-bottle.webp` | [Pexels photo 15509863](https://www.pexels.com/photo/glass-jars-on-shelf-15509863/) | Pexels License | — |
| `lab-shelf.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Laboratory-reagents.jpg) | CC BY-SA 3.0 | — |
| `cement-bags.webp` | [Pexels photo 16594605](https://www.pexels.com/photo/concrete-masonry-units-16594605/) | Pexels License | Wallace Chuck |
| `cooling-tower.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cooling_tower_at_BASF_antwerp.JPG) | CC0 | — |

Pexels License summary (full text: https://www.pexels.com/license/): free for commercial
and personal use, no attribution required. Restrictions: no use as a trademark/brand
mark, no reselling unaltered copies, no implying endorsement by people/brands shown,
no redistributing on other stock platforms. None of the images above depict
identifiable people or third-party brands, so they're clear for this use.

## To add more / replace a category

1. Search Wikimedia Commons (`commons.wikimedia.org`, keyless API) or Pexels
   (`pexels.com`, free-to-use license, no key needed for the CDN once you have a
   photo ID from the site).
2. **Verify the license before downloading** — for Commons, check
   `extmetadata.LicenseShortName` via the API
   (`action=query&prop=imageinfo&iiprop=extmetadata`); only use CC0/public
   domain/CC-BY/CC-BY-SA. Never use an image with visible third-party branding.
3. Resize to 1200×900 `cover` and re-encode as WebP (quality ~78) with `sharp`
   (already a project dependency) before adding to this folder.
4. Update this table and the mapping in `src/data/products/*.json`.
