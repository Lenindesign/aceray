# Aceray Design System — Typography Line-Height & Vertical Rhythm Standard

This document defines the official **Typography Line-Height System** and **8pt Grid Vertical Rhythm System** for the Aceray codebase. All pages, UI components, stylesheets, and Storybook stories must strictly adhere to these standards.

---

## 1. Global Typography Line-Height System

Line height must be proportional to font size and visual hierarchy. Inconsistent line height destroys typography rhythm and causes text in buttons, headers, or cards to sit off-center.

| Role / Element | Selector / Utility | Target Line-Height | Rationale & Guidance |
| :--- | :--- | :--- | :--- |
| **Hero Display Titles** | `h1`, `.hero-title`, `.family-hero-title h1` | `0.88` – `0.95` | Tight, architectural line height for ultra-large uppercase headings (`clamp(3rem, ...)`). Eliminates awkward gaps above/below hero titles. |
| **Section Headings** | `h2`, `h3`, `.section-title` | `1.15` – `1.25` | Balanced proportional spacing for structural headings. |
| **Buttons & Action CTAs** | `.btn`, `.btn-primary`, `.btn-outline` | `1.0` (with Flexbox) | Use `display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 1.75rem;` for 100% mathematical vertical text centering. Never use asymmetrical top/bottom padding. |
| **Pills & Badges** | `.tag`, `.cat-badge`, `.badge` | `1.0` – `1.2` | Clean optical centering inside small pills. |
| **Body Copy & Descriptions** | `p`, `.lede`, article copy | `1.65` – `1.70` | Optimal line length and ergonomic reading comfort meeting WCAG AA accessibility guidelines. |

---

## 2. Global 8pt Grid Vertical Rhythm System

All element margins, component gaps, container padding, and section breathing room MUST follow the **8pt Grid Scale** (with 4px micro-steps for tight labels).

| Design Token | Pixel Value | Rem Value | Primary Usage |
| :--- | :--- | :--- | :--- |
| `--space-0-5` | `4px` | `0.25rem` | Eyebrow tag to title spacing, hairline borders |
| `--space-1` | `8px` | `0.5rem` | Title to metadata gap, button icon spacing (`gap: 8px`) |
| `--space-1-5` | `12px` | `0.75rem` | Small stack list gaps |
| `--space-2` | `16px` | `1.00rem` | Paragraph bottom margin (`margin-bottom: 1rem`), mobile grid gap |
| `--space-3` | `24px` | `1.50rem` | Card internal padding (`p-6`), desktop grid gap (`gap-6`) |
| `--space-4` | `32px` | `2.00rem` | Section block separation |
| `--space-6` | `48px` | `3.00rem` | Internal card vertical padding buffers (`48px 32px`) |
| `--space-8` | `64px` | `4.00rem` | Sub-section vertical rhythm |
| `--space-10` | `80px` | `5.00rem` | Standard page section vertical padding (`py-20`) |
| `--space-16` | `128px` | `8.00rem` | Major landing/hero section padding (`py-32`) |

---

## 3. Strict Rules & Anti-Patterns

### ❌ Anti-Pattern 1: Asymmetrical Button Padding
```css
/* ❌ BAD: Asymmetrical top vs bottom padding causes text to sit off-center */
.btn-primary {
  padding: 15px 28px 13px 28px;
}

/* ✅ GOOD: Explicit container height + flexbox centering */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 1.75rem;
  line-height: 1;
}
```

### ❌ Anti-Pattern 2: Arbitrary Line Heights
```css
/* ❌ BAD: Default line-height 1.5 on large uppercase hero titles creates huge baseline gaps */
.hero-title {
  font-size: 5rem;
  line-height: 1.5;
}

/* ✅ GOOD: Tight architectural line height for display text */
.hero-title {
  font-size: 5rem;
  line-height: 0.92;
}
```

### ❌ Anti-Pattern 3: Arbitrary Pixel Offsets
```css
/* ❌ BAD: Random non-8pt pixel values */
.card {
  margin-top: 13px;
  padding: 19px 27px;
}

/* ✅ GOOD: Using 8pt design tokens */
.card {
  margin-top: var(--space-2); /* 16px */
  padding: var(--space-6) var(--space-4); /* 48px 32px */
}
```
