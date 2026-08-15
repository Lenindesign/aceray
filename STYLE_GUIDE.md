# STYLE_GUIDE.md

## Design System Overview

For page-level layout rules, container widths, spacing rhythm, heading hierarchy, grids, cards, and forms, also follow [`LAYOUT_GUIDE.md`](./LAYOUT_GUIDE.md).

- **Primary Brand Color**: `#718f80` (teal/green‑gray)
- **Secondary Accent**: `#2C3E35`
- **Headline Typography**: **Futura Std** (`'Futura Std', 'Montserrat', sans-serif`)
- **Body & Specs Typography**: **Geist** (`'Geist', sans-serif`)
- **Sizing System**: **8pt Grid System** (all margins, padding, gaps, radii, and container heights use 8px multiples, with 4px micro-steps).

### CSS Tokens (defined in `styles/base.css`)

```css
:root {
  /* Colors */
  --color-primary: #718f80;
  --color-primary-dark: #5a6e5e;
  --color-accent: #2C3E35;
  --color-text-main: #222222;
  --color-text-muted: #555555;
  --color-border: #E5E3DD;

  /* Typography */
  --font-heading: 'Futura Std', 'Montserrat', sans-serif;
  --font-sans: 'Geist', -apple-system, sans-serif;

  /* 8pt Grid Spacing Scale */
  --space-0-5: 0.25rem; /* 4px */
  --space-1: 0.5rem;    /* 8px */
  --space-1-5: 0.75rem; /* 12px */
  --space-2: 1rem;      /* 16px */
  --space-3: 1.5rem;    /* 24px */
  --space-4: 2rem;      /* 32px */
  --space-6: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */

  /* Radius Tokens */
  --radius-card: 16px;  /* 2 * 8px */
  --radius-sm: 8px;     /* 1 * 8px */
  --radius-btn: 4px;    /* 4px Architectural CTA Radius */
}
```

### Core Components (styled in `styles/components.css`)
- **Primary Button** – `.btn-primary` for solid sage green CTAs (`#718f80`) with pure white font (`#ffffff`), uppercase typography, `0.08em` tracking, and `var(--radius-btn)` (`4px`) architectural corner radius. Never override inline.
- **Outlined Button** – `.btn-outline` for secondary transparent CTAs with sage green border and text, filling solid green with white font on hover, and `var(--radius-btn)` (`4px`) corner radius.
- **Navbar** – `.navbar` with logo and navigation links.
- **Navigation Dropdowns** – Header dropdowns use the Base UI-powered shadcn `NavigationMenu` interaction layer with the global `.nav-menu-trigger`, `.nav-dropdown`, `.nav-dropdown-title`, and `.nav-dropdown-link` visual pattern. Product category dropdowns should mirror the catalog sidebar: opaque white card, subtle `rgba(0, 0, 0, 0.1)` border, `var(--radius-card)`, generous `var(--space-3)` padding, Geist `0.9rem` category rows, and soft active-row highlight. Keep the Base UI popup layer visually neutral so the Aceray card supplies the only border/shadow. Avoid CSS-only hover dropdowns and translucent panels over product grids.
- **Hero Section** – `.hero` utility class for centered headline.
- **Card Grid** – `.catalog-grid` for product listings.
- **Product Card** – `ProductCard.jsx` (`.product-card`) for universal product representation across home, catalog, and related sections. Features transparent image container (`background-color: transparent`, zero inner gray frame box), rounded outer borders (`16px` / `var(--radius-card)`), clean uppercase title typography, and RESTful routing (`/product/:slug`). Storybook story: `src/stories/ProductCard.stories.jsx`.
- **Universal Corner Radius Rule** – ALL card components (`.category-card`, `.product-card`, `.catalog-product-card`, `.catalog-sidebar`, `ui/card`, and showcase feature containers) MUST use the design token `var(--radius-card)` (`16px`). Ad-hoc smaller corner radiuses (e.g. `4px`) on full card containers are strictly forbidden.
- **Universal Spacing** – All pills, badges, cards, and interactive elements must include explicit, generous padding (minimum `8px 16px` for pills/badges, `16px 24px` for cards) and clean margins to avoid squished borders.

### Accessibility
- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`).
- Ensure contrast ratios meet WCAG AA (primary vs. background: 4.5:1).
- Provide `alt` text for images (logo already has `alt="Aceray logo"`).

### Usage
Import the CSS files in `index.html`:
```html
<link rel="stylesheet" href="/styles/base.css" />
<link rel="stylesheet" href="/styles/components.css" />
```
All components reference the CSS variables above, making them easy to theme.

---

*Generated for the Aceray redesign project – placed in the repository root so any IDE can locate it.*
