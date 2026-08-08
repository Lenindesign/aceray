# Aceray WordPress XML Source

The original WordPress XML export for Aceray is stored at:

`/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml`

This file is the canonical raw source for Aceray product migration, taxonomy, media attachment mapping, product PDFs, WordPress categories/tags, WooCommerce metadata, and schema audits.

## Handling Rules

- Do not paste or duplicate the full XML into notes or chat; it is about 84 MB.
- Use targeted parsing/searches when verifying a taxonomy or migration question.
- Prefer the raw XML when resolving disagreements between imported data and current frontend behavior.
- Keep derived summaries in Markdown and generated import data in repo-tracked files.

## Derived Project Files

- `sanity-products.ndjson`
- `src/importWordpressToSanity.js`
- `sanity-studio/schemaTypes/productType.ts`
- `PRODUCT_SCHEMA.md`

## Evidence Order

1. Raw WordPress XML export at the Desktop path above.
2. Importer logic in `src/importWordpressToSanity.js`.
3. Generated import snapshot in `sanity-products.ndjson`.
4. Current Sanity schema.
5. Frontend taxonomy helpers and UI behavior.

## Obsidian Notes

This `memory-bank` folder can be opened as an Obsidian vault or linked from a broader Aceray vault. Keep source indexes and derived decisions here, but do not copy the XML into the vault unless archival duplication is explicitly requested.
