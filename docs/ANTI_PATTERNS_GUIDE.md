# ANTI_PATTERNS_GUIDE.md — Aceray Frontend Anti-Patterns & Best Practices

This guide establishes the mandatory rules and architectural anti-patterns that MUST NOT be used in the Aceray codebase. Follow these rules to keep the CSS, HTML, and React components clean, maintainable, and aligned with modern web standards.

---

## 1. CSS Anti-Patterns

### ❌ Anti-Pattern 1: `!important` Overuse (Specificity Warfare)
* **What it is**: Appending `!important` to CSS properties to force style application.
* **Why it's forbidden**: Overrides the natural CSS cascade, prevents easy component customization, and triggers an escalating specificity war where future overrides require even more `!important` flags.
* **Correct Practice**:
  * Use proper selector specificity (e.g. `.family-hero-title .family-eyebrow` instead of `.family-eyebrow !important`).
  * Structure CSS in cascade order or use `@layer` blocks.
  * **Allowed Exception**: Accessibility resets (e.g., `@media (prefers-reduced-motion)` animation disables) or full-screen viewport modal locks.

```css
/* ❌ BAD: Forcing overrides with !important */
.family-hero-designer {
  font-size: 0.68rem !important;
  color: #ffffff !important;
}

/* ✅ GOOD: Using natural CSS selector specificity */
.family-hero-title .family-hero-designer {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.88);
}
```

---

### ❌ Anti-Pattern 2: Inline Style Overrides (`style={{ ... }}`)
* **What it is**: Hardcoding inline CSS styles directly inside React components or HTML tags.
* **Why it's forbidden**: Creates ultra-high specificity that bypasses stylesheet files, breaks design token consistency, and prevents media queries / hover states.
* **Correct Practice**: Always use CSS classes (`.btn-primary`, `.product-card`) and CSS custom property variables (`var(--color-primary)`).

```jsx
// ❌ BAD: Hardcoding inline style overrides
<button style={{ backgroundColor: '#718f80', padding: '15px 28px' }}>Explore</button>

// ✅ GOOD: Using clean semantic design class
<button className="btn-primary">Explore</button>
```

---

### ❌ Anti-Pattern 3: Magic Numbers & Arbitrary Pixel Values
* **What it is**: Using random, arbitrary pixel offsets like `margin-top: 13px;` or `left: 47px;`.
* **Why it's forbidden**: Destroys visual rhythm, creates brittle layouts that break across screen sizes, and violates grid systems.
* **Correct Practice**: Strictly adhere to the **8pt Grid System** (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`) and use spacing tokens (`var(--space-2)`, `var(--space-4)`).

```css
/* ❌ BAD: Arbitrary magic numbers */
.card-content {
  padding: 19px 23px;
  margin-top: 13px;
}

/* ✅ GOOD: Following the 8pt Grid Scale */
.card-content {
  padding: var(--space-3) var(--space-4); /* 24px 32px */
  margin-top: var(--space-2);             /* 16px */
}
```

---

### ❌ Anti-Pattern 4: Hardcoded Hex Colors Instead of Design Tokens
* **What it is**: Scattering raw hex codes (like `#718f80` or `#4d6c5e`) across dozens of CSS rules.
* **Why it's forbidden**: Makes theming, color adjustments, or dark mode updates impossible to maintain from a central location.
* **Correct Practice**: Use predefined CSS custom properties from `styles/base.css`.

```css
/* ❌ BAD: Scattering raw color strings */
.banner {
  background-color: #718f80;
}

/* ✅ GOOD: Referencing core brand tokens */
.banner {
  background-color: var(--color-primary);
}
```

---

### ❌ Anti-Pattern 5: Over-Nested CSS Selectors (Deep Naming Trees)
* **What it is**: Writing 4+ level deep selectors like `.header .container .nav-wrapper .nav-links .nav-item a span`.
* **Why it's forbidden**: Couples CSS tightly to fragile HTML structures and inflates bundle sizes.
* **Correct Practice**: Use flat, descriptive component class names (1–2 levels max).

```css
/* ❌ BAD: Tightly coupled deep selector tree */
.header .header-container nav .nav-links .nav-item .nav-menu-trigger {
  font-size: 0.78rem;
}

/* ✅ GOOD: Flat BEM-style component class */
.nav-menu-trigger {
  font-size: 0.78rem;
}
```

---

## 2. Layout & UI Anti-Patterns

### ❌ Anti-Pattern 6: Inner Gray Frame Boxes on Product Media ("Container-in-Container")
* **What it is**: Placing product photos inside inner `#fafafa` or `#f3f3f3` gray boxed containers.
* **Why it's forbidden**: Produces a heavy, dated aesthetic that distracts from clean product photography.
* **Correct Practice**: Product image wrappers MUST use `background-color: transparent` with zero inner gray frame box (`#fafafa` forbidden).

---

### ❌ Anti-Pattern 7: Ad-Hoc Small Corner Radiuses (Radius Inconsistency)
* **What it is**: Mixing random corner radii like `4px` on cards, `8px` on modals, and `2px` on containers without system logic.
* **Why it's forbidden**: Undermines visual cohesion across pages.
* **Correct Practice**: All main cards (`.category-card`, `.product-card`, `.catalog-product-card`, `.catalog-sidebar`, UI cards) MUST use `var(--radius-card)` (`16px`). Buttons and controls use `var(--radius-sm)` (`4px`–`8px`).

---

### ❌ Anti-Pattern 8: Squished Text & Missing Padding Buffers
* **What it is**: Omitting explicit inner padding on badges, pills, cards, or stat containers, causing text to touch borders.
* **Why it's forbidden**: Severely impairs readability and creates uncomfortable visual tension.
* **Correct Practice**: Include explicit padding buffers (minimum `8px 16px` for pills/badges, `16px 24px` for card containers).

---

### ❌ Anti-Pattern 9: Misusing Heading Tags for Visual Font Sizing
* **What it is**: Using `<h3>` or `<h1>` tags solely to make text visually larger, or `<h6>` to make it smaller.
* **Why it's forbidden**: Breaks screen reader navigation and SEO document hierarchy.
* **Correct Practice**: Use semantic HTML for document outline (`<h1>` once per page for main title, `<h2>` for major sections) and control visual size via CSS (`font-size`, `.section-title`, `.hero-title`).

---

### ❌ Anti-Pattern 10: Using Hardcoded `px` for Layout Spacing & Font Sizes Instead of `rem` / Tokens
* **What it is**: Hardcoding raw `px` values for margins, paddings, gaps, and font-sizes (e.g. `margin-bottom: 16px; font-size: 14px;`).
* **Why it's forbidden**: Prevents layout and text from scaling fluidly when users adjust default browser font sizes or zoom levels for accessibility.
* **Correct Practice**:
  * Use `rem` units or CSS Spacing Tokens (`var(--space-1)`, `var(--space-2)`, `0.875rem`, `1rem`, `0.125rem` = 2px) for typography, margins, gaps, and paddings.
  * **Allowed Exception for `px`**: Micro-borders (`1px solid var(--color-border)`), thin divider lines, SVG vector strokes, or hairline shadow offsets.

---

### ❌ Anti-Pattern 11: Overusing Tailwind Arbitrary Hex/Style Overrides inside JSX
* **What it is**: Hardcoding Tailwind arbitrary classes like `bg-[#718f80]`, `text-[#222222]`, `p-[13px]`, or `font-['Futura_Std']` directly in JSX.
* **Why it's forbidden**: Duplicates styling logic, bypasses CSS design tokens, and creates messy inline class attributes.
* **Correct Practice**:
  * **Use Tailwind for**: Layout scaffolding, responsive display utilities, flex/grid alignment, and container constraints (`flex items-center justify-between`, `grid grid-cols-1 md:grid-cols-3`, `hidden md:block`, `w-full max-w-7xl`).
  * **Use Vanilla CSS & Design Tokens for**: Component styling, brand colors, typography, buttons, product cards, inputs, and borders (`.btn-primary`, `.product-card`, `var(--color-primary)`).

---

## 3. Tailwind CSS Architectural Guidelines

| Aspect | Use Tailwind CSS ✅ | Use Vanilla CSS & Tokens ❌ (No Tailwind) |
| :--- | :--- | :--- |
| **Flexbox & Grid** | `flex items-center justify-between gap-4` | Avoid manual flex boilerplate in custom CSS |
| **Responsive Utilities** | `hidden md:flex`, `grid-cols-1 lg:grid-cols-4` | Component breakpoint utilities |
| **Component Styling** | DO NOT use Tailwind arbitrary classes | Use `.btn-primary`, `.product-card`, `.nav-dropdown` |
| **Brand Colors** | DO NOT use `bg-[#718f80]` in JSX | Use `var(--color-primary)` in CSS stylesheets |
| **Typography** | DO NOT use `font-['Futura']` in JSX | Use `var(--font-heading)` / `var(--font-sans)` |

---

## 4. Quick Reference Checklist for Code Reviews

| Rule | Anti-Pattern ❌ | Best Practice ✅ |
| :--- | :--- | :--- |
| **CSS Overrides** | `!important` everywhere | Proper selector specificity |
| **Styles** | Inline `style={{ ... }}` | Central CSS classes & design tokens |
| **Color Tokens** | `#718f80` in component CSS | `var(--color-primary)` |
| **Grid & Spacing** | `margin: 13px 27px;` | 8pt Grid (`var(--space-2)`, `var(--space-3)`) |
| **Units (px vs rem)**| Hardcoded `px` for font & layout | `rem` & CSS tokens (`0.125rem`, `1rem`, `var(--space-2)`) |
| **Tailwind Usage** | Arbitrary `bg-[#718f80]` in JSX | Layout utilities only (`flex`, `grid`); tokens in CSS |
| **Product Photos** | Inner `#fafafa` gray box wrapper | `background-color: transparent` |
| **Cards Corner Radius**| `border-radius: 4px` on full cards | `var(--radius-card)` (`16px`) |
| **CTA Corner Radius** | Arbitrary `border-radius: 8px` or `0px` on CTAs | `var(--radius-btn)` (`4px`) architectural standard |
| **Primary Buttons** | Custom inline background/font colors | `.btn-primary` standard class |
