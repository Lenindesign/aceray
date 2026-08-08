# Aceray Product Taxonomy And Schema

This file is the global taxonomy contract for the Aceray app. It defines how the app should interpret product data imported from WordPress XML into Sanity, and which product concepts are allowed to power customer-facing UI.

## Source Evidence

- Canonical raw source: `/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml`
- Current generated app source: `sanity-products.ndjson`
- Import pipeline: `src/importWordpressToSanity.js`
- Sanity product schema: `sanity-studio/schemaTypes/productType.ts`
- Project memory-bank index: `memory-bank/aceray-wordpress-xml-source.md`

The original WordPress XML is present outside the repo and is the highest-authority source for migration, taxonomy, media, and curated product relationships. `sanity-products.ndjson` is still useful as the generated import snapshot used by the app, but it does not currently include every important XML field.

Current local snapshot:

- XML file size: 87,874,949 bytes
- 14,446 total WordPress XML items
- 943 raw WooCommerce `product` posts
- 704 product documents
- 702 products with image data
- Product categories and tags are raw WordPress taxonomy values
- 691 published products have XML `from_this_collection` data
- 691 published products have XML `you_may_also_like` data
- There is no explicit `family`, `productType`, `material`, `feature`, `fromThisCollection`, or `youMayAlsoLike` field in the imported Sanity product data yet

## Current Raw Product Fields

The current Sanity `product` document stores these key fields:

- `title`
- `slug`
- `designer`
- `madeIn`
- `categories`
- `tags`
- `imageUrl`
- `galleryUrls`
- `mainImage`
- `gallery`
- `description`
- `overallHeight`
- `overallWidth`
- `overallDepth`
- `seatHeight`
- `weight`
- `com`
- `stacking`
- `productPdfs`
- `isNewArrival`
- `wpPostId`

Important XML fields not yet stored in the generated product documents:

- `from_this_collection`
- `_from_this_collection`
- `you_may_also_like`
- `_you_may_also_like`
- `_crosssell_ids`
- `_upsell_ids`

## Target Product Model

The app should treat raw `categories` and `tags` as migration input, not as a clean product model. Every product should resolve into these concepts.

### Product Family

Definition: the named design family or collection a product belongs to.

Examples from current data:

- `Solo`
- `Riva`
- `Grande`
- `Pronto`
- `Libro`
- `Gala`
- `Ciao`
- `Arte`
- `Alba`
- `Bora`
- `Mira`
- `Forte`
- `Ampio`

Rules:

- Family powers the **From This Collection** module.
- Family can appear as a product detail chip.
- Family can be used as a catalog filter.
- Family should be excluded from the lower **You May Also Like** module to avoid duplicating the collection module.
- If a family is not explicitly modeled, infer it from the product title prefix when possible. Example: `SOLO-V` maps to `Solo`; `RIVA-7U` maps to `Riva`; `GRANDE-1` maps to `Grande`.
- Do not treat broad taxonomy buckets as families.

### Product Type

Definition: the commercial seating or table category a buyer uses to browse.

Canonical product types:

- `Side Chairs`
- `Armchairs`
- `Lounge Seating`
- `Barstools`
- `Counter Stools`
- `Low Stools / Ottomans`
- `Benches`
- `Tables & Bases`
- `Outdoors`

Common raw variants and mappings:

- `Lounge Chair` -> `Lounge Seating`
- `Table Base`, `Table Bases`, `Bar Height Table Base`, `Dining Height Table Base`, `Low Table Base`, `Tables RTS`, `Table Tops` -> `Tables & Bases`
- `Side Chairs RTS` -> `Side Chairs` plus `Ready to Ship`
- `Armchairs RTS` -> `Armchairs` plus `Ready to Ship`
- `Barstools RTS` -> `Barstools` plus `Ready to Ship`
- `Counter Stools RTS` -> `Counter Stools` plus `Ready to Ship`
- `Benches RTS`, `Bench` -> `Benches` plus `Ready to Ship` when applicable

Rules:

- Product type should be the first product detail chip when known.
- Product type powers primary catalog navigation.
- Product type is the highest-weight related-products signal.
- Product type should appear in breadcrumbs before raw family when both exist.

### Material And Construction

Definition: buyer-relevant material, frame, finish, or upholstery construction.

Canonical material/construction buckets:

- `Wood`
- `Upholstery`
- `Chrome`
- `Chrome + Black`
- `Matte + Chrome`
- `Outdoor Powder Coat Steel`

Legacy/material-adjacent buckets:

- `Extrema Metal` appears on 304 products but should usually be treated as an internal/legacy line unless the team confirms it is customer-facing.

Rules:

- Material/construction may appear as a product detail chip when buyer-facing.
- Material/construction should help related-products scoring.
- Do not let internal or overly broad material buckets outrank product type or family.

### Feature Flags

Definition: functional attributes that affect buyer intent.

Canonical feature flags:

- `Ready to Ship`
- `Stacking`
- `Swivel`
- `Outdoor`
- `Rocker`
- `Sled`
- `Caster`
- `Dolly`
- `Ganging`

Rules:

- Feature flags should support filters and recommendations.
- Feature flags can be derived from categories, tags, `stacking`, and description.
- `Ready to Ship` should be true when categories or tags include `Ready to Ship`, `RTS`, or an RTS category variant.
- `Stacking` should be true when `stacking` is not `No`, or categories/tags include stacking terms.
- `Outdoor` should be true when categories/tags include `Outdoors`, `Outdoor Seating`, or outdoor powder coat terms.
- Feature flags may appear in chips when especially relevant, but should not crowd out product type, family, and primary material.

### Use Context Tags

Definition: usage and search-intent descriptors imported from WordPress tags.

Examples:

- `hospitality`
- `restaurant seating`
- `guest seating`
- `lobby seating`
- `office seating`
- `student housing`
- `dining`
- `quick ship`

Rules:

- Use context tags for search and related-products scoring.
- Do not render raw use-context tags as primary chips by default.
- Normalize case before matching. Example: `Ready To Ship` and `ready to ship` are the same signal.

### Curated Product Relationships From XML

Definition: editor-curated product lists stored in WordPress ACF metadata.

Canonical relationship fields:

- `from_this_collection`: primary source for the **From This Collection** product module.
- `you_may_also_like`: primary source for the **You May Also Like** product module.

Parsing rules:

- Values are serialized PHP arrays of WordPress post IDs.
- Preserve the XML order exactly when rendering or importing.
- Resolve IDs by matching each related ID to a product document's `wpPostId`.
- Filter missing, draft, private, trashed, or non-product references gracefully.
- Do not treat `_from_this_collection` or `_you_may_also_like` as product data. They are ACF field-key references.
- Do not use `_upsell_ids` as the primary relationship source; it is empty in the verified XML product set.
- Do not use `_crosssell_ids` as the primary relationship source; it is sparsely populated and does not represent the curated modules.

Verified XML counts:

- 922 raw product posts have `from_this_collection`.
- 922 raw product posts have `you_may_also_like`.
- 691 published product posts have `from_this_collection`.
- 691 published product posts have `you_may_also_like`.
- 8 raw product posts have populated `_crosssell_ids`.
- 0 raw product posts have populated `_upsell_ids`.

Verified examples:

- `SOLO-V`
  - `from_this_collection`: `SOLO-T`
  - `you_may_also_like`: `SOLO-T`, `SOLO-P`, `SOLO-PXL`, `CIAO-7U`, `CIAO-7UU`, `ALMEA-7UU`, `#783NS`, `BOLIDE36`, `SOLO-B`, `SOLO-GQ`, `DUO33H`

- `RIVA-7U`
  - `from_this_collection`: `RIVA-1U`, `RIVA-3U`, `RIVA-3RU`, `RIVA-5U`, `RIVA-61U`, `RIVA-7RU`, `RIVA-1CO`, `RIVA-3CO`, `RIVA-3RCO`, `RIVA-51CO`, `RIVA-6CO`, `RIVA-61CO`, `RIVA-7CO`, `RIVA-7RCO`, `RIVA-1SL`, `RIVA-3SL`, `RIVA-3RSL`, `RIVA-5SL`, `RIVA-51SL`, `RIVA-7RSL`
  - `you_may_also_like`: `CORSO-7`, `ALMEA-7`, `ALMEA-7UU`, `AMPIO-7SWIV4P`, `CIAO-7U`, `CIAO-7UU`, `CASA-WSWIV4P`, `OASI-LBUSWIV4P`, `TANA-7SWIV4P`, `SOLO-QN`

- `GRANDE-1`
  - `from_this_collection`: `GRANDE-5`, `GRANDE-6`
  - `you_may_also_like`: `RIVA-1SL`, `#100-03`, `#100-18`, `MIRA-1SX2`, `MIRA-1SX3`, `ARTE-1U`, `ALMEA-1S`, `CIAO-1UW`, `GALA-1UO`

- `PRONTO-2`
  - `from_this_collection`: `PRONTO-1`, `PRONTO-3`, `PRONTO-5`, `PRONTO-7`, `PRONTO-LOVE`
  - `you_may_also_like`: `LIDO-LOVE`, `LIDO-7`, `LIDO-5`, `POSTO-LOVE`, `POSTO-3`, `BRIO-3`, `NOVA`, `#120-02`

- `LIBRO-5SLED`
  - `from_this_collection`: `LIBRO-1`, `LIBRO-1SLED`, `LIBRO-1SWIV5PC`, `LIBRO-SWIV4P2`, `LIBRO-3`, `LIBRO-5`, `LIBRO-6`, `LIBRO-6SLED`
  - `you_may_also_like`: `OVVIO-5`, `#550SLED-01`, `#550SLED-03`, `TABOUR-B5`, `#646XLF`, plus two XML IDs that do not resolve to published product documents in the current import snapshot

## Legacy/Internal Buckets

These raw categories are present in the imported data but should not be treated as product detail chips, primary filters, families, or recommendation labels unless explicitly approved.

| Raw bucket | Count | Recommended treatment |
|---|---:|---|
| `Planet` | 426 | Hide from customer-facing chips; internal/legacy taxonomy |
| `Aurea` | 423 | Hide from customer-facing chips; internal/legacy taxonomy |
| `Skill` | 423 | Hide from customer-facing chips; internal/legacy taxonomy |
| `Extrema Metal` | 304 | Hide from default chips; may inform material/scoring if approved |
| `What's New` | 60 | Convert to `isNewArrival` or new-arrival merchandising flag |
| `Uncategorized` | 4 | Ignore |
| `Products` | 25 | Ignore as generic taxonomy noise |
| `Family` | 33 | Ignore as generic taxonomy noise |
| `Materials` | 22 | Ignore as generic taxonomy noise |

## Product Detail Display Rules

Product page chips should show the most useful buyer-facing concepts in this order:

1. Product type
2. Product family
3. Buyer-facing material/construction
4. Important feature or availability flag

Never show these as product detail chips by default:

- `Aurea`
- `Planet`
- `Skill`
- `Extrema Metal`
- `Uncategorized`
- `What's New`
- `Products`
- `Family`
- `Materials`

Examples:

- `SOLO-V`
  - Raw categories: `Aurea`, `Lounge Seating`, `Planet`, `Skill`, `Solo`, `Upholstery`, `What's New`, `Wood`
  - Display chips: `Lounge Seating`, `Solo`, `Wood`, `Upholstery`

- `RIVA-7U`
  - Raw categories: `Aurea`, `Extrema Metal`, `Lounge Seating`, `Planet`, `Riva`, `Skill`, `Upholstery`, `What's New`, `Wood`
  - Display chips: `Lounge Seating`, `Riva`, `Wood`, `Upholstery`

- `GRANDE-1`
  - Raw categories: `Grande`, `Side Chairs`, `What's New`, `Wood`
  - Display chips: `Side Chairs`, `Grande`, `Wood`

- `PRONTO-2`
  - Raw categories: `Benches RTS`, `Outdoors`, `Pronto`, `Ready to Ship`, `Stacking 2-Seater`
  - Display chips: `Outdoors`, `Pronto`, `Benches`, `Ready to Ship` or `Stacking`

## Breadcrumb Rules

Breadcrumbs should use buyer-facing categories.

Preferred order:

1. `Home`
2. `Products`
3. Primary product type
4. Product title

Do not use `Aurea`, `Planet`, `Skill`, or `What's New` as the breadcrumb category when a product type is available.

## Catalog Filter Rules

Catalog should support:

- Canonical product type filters
- Family filters, such as `?cat=solo`, `?cat=riva`, `?cat=grande`
- Material/construction filters when useful
- Feature filters such as ready-to-ship, outdoor, stacking, swivel

Family filter matching should be case-insensitive and should normalize slug-shaped values.

Examples:

- `?cat=grande` -> category `Grande`
- `?cat=riva` -> category `Riva`
- `?cat=chrome-+-black` -> category `Chrome + Black`
- `?cat=side-chairs` -> category `Side Chairs`

Do not expose the broad legacy buckets as visible sidebar filters unless the business explicitly wants them.

## Collection Module Rules

**From This Collection**:

- Use XML `from_this_collection` as the canonical source when present and valid.
- Preserve the curated XML order.
- Resolve related IDs through `wpPostId`.
- Filter missing or unpublished references without failing the whole module.
- Exclude the current product.
- Use family matching only as a fallback when `from_this_collection` is missing, empty, or resolves to no renderable products.
- Label should be family-specific, for example `Solo collection family`.
- If only one related product exists, still render the module if it came from XML curation or a meaningful family match.

## Related Products Rules

**You May Also Like** should be intent-based, not a simple recency list.

Use XML `you_may_also_like` as the canonical source when present and valid:

- Preserve the curated XML order.
- Resolve related IDs through `wpPostId`.
- Filter missing or unpublished references without failing the whole module.
- Exclude the current product.
- Do not exclude same-family products when they are explicitly curated in XML. The source curation is stronger than inferred deduplication.

Use inferred scoring only as a fallback when XML `you_may_also_like` is missing, empty, or resolves to no renderable products.

Fallback scoring:

- +50 same product type
- +25 same buyer-facing material/construction
- +10 shared intent feature, such as stacking, swivel, outdoor, ready-to-ship, upholstered, leather, wood
- +6 per shared tag, capped at +30
- +4 per shared raw category, capped at +20
- +8 same designer
- +4 same `madeIn`
- Exclude current product
- Exclude same family only in the inferred fallback, because family is already handled by **From This Collection**

Recommended subtitle:

- Product type + material known: `More wood side chairs selected for similar applications`
- Product type only: `Related side chairs selected for similar applications`
- Fallback: `Related pieces selected for similar applications`

## Recommended Sanity Schema Evolution

The current schema stores raw taxonomy in `categories` and `tags`. This is workable for migration, but the long-term model should add normalized fields while preserving the raw import values.

Recommended future fields:

```ts
defineField({
  name: 'family',
  title: 'Family',
  type: 'string',
})

defineField({
  name: 'productType',
  title: 'Product Type',
  type: 'string',
  options: {
    list: [
      'Side Chairs',
      'Armchairs',
      'Lounge Seating',
      'Barstools',
      'Counter Stools',
      'Low Stools / Ottomans',
      'Benches',
      'Tables & Bases',
      'Outdoors',
    ],
  },
})

defineField({
  name: 'materials',
  title: 'Materials / Construction',
  type: 'array',
  of: [defineArrayMember({ type: 'string' })],
  options: { layout: 'tags' },
})

defineField({
  name: 'features',
  title: 'Features',
  type: 'array',
  of: [defineArrayMember({ type: 'string' })],
  options: { layout: 'tags' },
})

defineField({
  name: 'legacyCategories',
  title: 'Legacy WordPress Categories',
  type: 'array',
  of: [defineArrayMember({ type: 'string' })],
  readOnly: true,
})

defineField({
  name: 'relatedProducts',
  title: 'Legacy Curated Related Products',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'reference',
      to: [{ type: 'product' }],
    }),
  ],
  deprecated: {
    reason: 'Use fromThisCollection and youMayAlsoLike for the two distinct product modules.',
  },
})

defineField({
  name: 'fromThisCollection',
  title: 'From This Collection',
  type: 'array',
  description: 'Ordered product references imported from WordPress ACF from_this_collection.',
  of: [
    defineArrayMember({
      type: 'reference',
      to: [{ type: 'product' }],
    }),
  ],
})

defineField({
  name: 'youMayAlsoLike',
  title: 'You May Also Like',
  type: 'array',
  description: 'Ordered product references imported from WordPress ACF you_may_also_like.',
  of: [
    defineArrayMember({
      type: 'reference',
      to: [{ type: 'product' }],
    }),
  ],
})

defineField({
  name: 'legacyRelatedProductIds',
  title: 'Legacy Related Product IDs',
  type: 'object',
  readOnly: true,
  fields: [
    defineField({
      name: 'fromThisCollection',
      title: 'From This Collection WP IDs',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'youMayAlsoLike',
      title: 'You May Also Like WP IDs',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
})
```

Sanity best-practice notes:

- Shared taxonomy such as product families and product types may eventually become reference documents if the team needs editable descriptions, landing pages, ordering, SEO metadata, or merchandising control.
- Product-to-product relationships should be Sanity references, not slug-derived IDs. Keep WordPress IDs in explicit legacy fields for traceability and import repair.
- Use `defineField` and `defineArrayMember` when this contract is converted into Sanity schema code.

## Migration Rules

When importing from WordPress XML:

1. Preserve raw `product_cat` values as `legacyCategories`.
2. Preserve raw `product_tag` values as `tags` or `legacyTags`.
3. Preserve `wpPostId` as the stable legacy reference for every product.
4. Parse `from_this_collection` and `you_may_also_like` from WordPress postmeta as ordered arrays of WordPress post IDs.
5. Store the raw parsed relationship IDs in `legacyRelatedProductIds.fromThisCollection` and `legacyRelatedProductIds.youMayAlsoLike`.
6. Build a product lookup by `wpPostId`, then resolve parsed relationship IDs into Sanity product references for `fromThisCollection` and `youMayAlsoLike`.
7. Preserve relationship order from the XML after filtering missing or unpublished products.
8. Ignore `_from_this_collection` and `_you_may_also_like` as ACF field-key metadata.
9. Treat `_crosssell_ids` and `_upsell_ids` as secondary WooCommerce metadata, not module data.
10. Derive `family` from:
   - category matching product title prefix, then
   - non-legacy, non-type, non-feature category fallback.
11. Derive `productType` from canonical type categories and known raw variants.
12. Derive `materials` from material/construction categories.
13. Derive `features` from categories, tags, `stacking`, and description.
14. Convert `What's New` into `isNewArrival` only when it reflects current merchandising, not historical import noise.

## Current Implementation Contract

Until normalized Sanity fields exist, frontend helpers should be the single source of truth for:

- `getCollectionFamily(product)`
- `getFromThisCollectionProducts(product, candidates)`
- `getYouMayAlsoLikeProducts(product, candidates)`
- `getPrimaryProductType(categories, family)`
- `getPrimaryMaterial(categories)`
- `getProductDisplayCategories(product)`
- `getIntentRelatedProducts(product, candidates, family)`
- catalog category/family matching

Avoid duplicating taxonomy logic across product page, catalog page, cards, header search, and future filters. The next implementation step should be to move these helpers into a shared module such as `src/lib/productTaxonomy.js` and make every surface import from it.

Relationship helper rules:

- `getFromThisCollectionProducts` should use `fromThisCollection` first, then `legacyRelatedProductIds.fromThisCollection`, then family fallback.
- `getYouMayAlsoLikeProducts` should use `youMayAlsoLike` first, then `legacyRelatedProductIds.youMayAlsoLike`, then inferred intent scoring.
- The current frontend inferred related-products logic is a fallback, not the preferred curation source.
- `src/data/curatedProductRelationships.json` is a temporary XML-derived bridge for the current frontend while the production Sanity dataset lacks these fields. Remove it once `fromThisCollection` and `youMayAlsoLike` are imported and queried reliably from Sanity.
