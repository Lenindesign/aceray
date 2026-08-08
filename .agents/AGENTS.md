# AGENTS.md - Project Rules for Aceray

## General Project Rules

1. **Always Follow Workspace Markdown Guides**:
   Before making design, structural, or code edits, check and strictly observe [STYLE_GUIDE.md](file:///Users/leninaviles/Projects/Aceray/STYLE_GUIDE.md) and [APP_GUIDE.md](file:///Users/leninaviles/Projects/Aceray/APP_GUIDE.md).

2. **Design Tokens & Palette**:
   - Maintain `--color-primary: #718f80;` and Montserrat typography (`'Montserrat', sans-serif`).
   - Use predefined CSS variables from `styles/base.css` and component classes from `styles/components.css`.

3. **Universal CTA & Button System**:
   - Primary Call-to-Action (`.btn-primary`): MUST have solid sage green background (`var(--color-primary)`), pure white font (`color: #ffffff`), uppercase typography (`text-transform: uppercase`), tracking (`letter-spacing: 0.08em`), and consistent hover state (`background-color: var(--color-primary-dark)`). NEVER use inline style overrides on `.btn-primary`.
   - Secondary / Outlined CTA (`.btn-outline`): Use `.btn-outline` for transparent buttons with green border and green text, which turn solid green with white font on hover.
   - Consistent Experience: Ensure CTAs across all pages, Storybook stories, and components adhere to these exact classes without ad-hoc inline background/color hacks.

4. **Universal Padding & Spacing**:
   - Badges, pills, cards, and modal containers MUST include explicit, generous padding (minimum `8px 16px` for pills/badges, `16px 24px` for cards) and clean margins to prevent squished text or touching borders.

5. **Accessibility**:
   - Always use semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
   - Ensure all image elements include descriptive `alt` tags.

6. **Universal Product Card System**:
   - ALL product grid items, catalog cards, and related product items MUST use `ProductCard.jsx` (`import ProductCard from '@/components/ProductCard'`).
   - Product photo wrappers (`.product-image-wrapper` / `.catalog-product-image`) MUST use `background-color: transparent` with ZERO inner gray frame box (`#fafafa` forbidden).
   - Product links MUST use clean RESTful routes (`/product/${slug}`).
   - Documented and tested in Storybook (`src/stories/ProductCard.stories.jsx`).

7. **Universal Card Radius System**:
   - ALL card containers (`.category-card`, `.product-card`, `.catalog-product-card`, `.catalog-sidebar`, and UI cards) MUST use the design token `var(--radius-card)` (`16px`). Ad-hoc smaller corner radiuses (e.g., `4px`) on full card containers are strictly forbidden.

8. **Universal Sizing & Spacing System (8pt Grid Rule)**:
   - All margins, padding, gaps, corner radii, and container dimensions MUST strictly follow the **8pt Grid System** (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `96px`).

9. **Dual Typography System**:
   - Headlines & Titles (`h1`, `h2`, `h3`, `.section-title`, `.category-title`, `.product-detail-title`) MUST use **Futura Std** (`var(--font-heading)`).
   - Body text, specifications, descriptions, navigation links, buttons, and UI controls MUST use **Geist** (`var(--font-sans)`).

10. **Universal Section Spacing & Padding Buffers (Breathability Rule)**:
    - Page sections MUST maintain generous vertical breathing room (`py-20 md:py-32` / `80px–128px`).
    - Internal card containers (like stat boxes, pillar cards, and banner callouts) MUST include explicit inner padding buffers (minimum `py-12 px-8` / `48px 32px`) so text, titles, and numbers never touch borders or sit tightly against container edges.

11. **Universal Feature Showcase Module System**:
    - ALL feature story modules, brand highlights, and heritage showcases across all pages MUST use the global `.feature-showcase`, `.feature-grid`, `.feature-image`, and `.feature-text` component classes from `styles/components.css`.
    - Headlines MUST use **Futura Std** uppercase (`var(--font-heading)`), font-weight 500, line-height 1.2, and tracking `0.05em`.
    - Eyebrow tags MUST use `.tag` (`color: var(--color-primary)`, `text-transform: uppercase`, `letter-spacing: 0.12em`, `font-family: var(--font-sans)`).
    - Body text MUST use **Geist** (`var(--font-sans)`), size `1.05rem`, line-height `1.65`, and `color: var(--color-text-muted)`.
