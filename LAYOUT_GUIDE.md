# Aceray Layout Guide

Use this guide when creating or updating any app page. It keeps page spacing, headings, grids, and cards consistent across Home, Catalog, Product, About, Contact, Resources, and future pages.

## Container Widths

Use the container tokens from `styles/base.css`.

- `--container-app` (`1264px`): default page and section content width.
- `--container-wide` (`1340px`): dense product/catalog views that need sidebars or broad grids.
- `--container-text` (`896px`): focused text sections, hero copy, and centered CTA content.

Full-width background bands are allowed, but inner content should use `.container` with one of the container tokens.

## Page Structure

Every page should follow this structure:

```jsx
<div className="[page-name]-page">
  <section className="container [page-name]-page-container">
    <div className="[page-name]-page-heading">
      <span className="[page-name]-page-eyebrow">Eyebrow</span>
      <h1>Page Title</h1>
    </div>
    {/* page content */}
  </section>
</div>
```

## Spacing

Use the 8pt spacing tokens from `styles/base.css`.

- Page vertical padding: `clamp(var(--space-8), 8vw, var(--space-12))`.
- Major section gaps: `var(--space-6)` to `var(--space-8)`.
- Grid gaps: `var(--space-4)` for cards and content groups.
- Card padding: minimum `var(--space-3)`; prefer `clamp(var(--space-4), 4vw, var(--space-6))` for large modules.
- Form fields and compact rows: use `var(--space-1)` to `var(--space-2)`.

Avoid ad-hoc Tailwind spacing on full page structures when a page class would make the rhythm reusable.

## Headings

- Eyebrows: Geist, uppercase, `var(--font-size-xs)`, bold, `0.15em` letter spacing, primary color.
- Page titles: Futura/heading font, uppercase via global heading rules, `clamp(2rem, 4vw, 3rem)`, line-height near `1.12`.
- Section titles: heading font, `clamp(1.75rem, 3vw, 2.5rem)`.
- Card titles: heading font, `clamp(1.125rem, 1.8vw, 1.25rem)`.

Do not scale fonts directly with viewport units outside `clamp()`.

## Grids

- Product/card grids should use `repeat(n, minmax(0, 1fr))`.
- Two-column editorial layouts should use `minmax(0, 1fr)` columns and collapse to one column at `1024px`.
- Three-card rows should collapse to one column at `1024px`.
- Use stable gaps and avoid nesting visual cards inside other cards.

## Cards And Panels

- Card radius must use `var(--radius-card)`.
- Card borders should use `var(--color-border)`.
- Card padding must be explicit and generous.
- Decorative icons are optional only when they add real meaning; avoid icons in informational text modules unless requested.

## Forms

- Inputs and textareas should use Geist, `var(--font-size-base)`, `var(--radius-sm)`, and `var(--color-border)`.
- Minimum control height should be `48px`.
- Focus state should use `var(--color-primary)` plus a subtle outline or shadow.
- Buttons should use `.btn-primary` or `.btn-outline` rather than inline button colors.
