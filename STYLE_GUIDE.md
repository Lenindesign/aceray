# STYLE_GUIDE.md

## Design System Overview

- **Primary Brand Color**: `#718f80` (teal/green‑gray)
- **Secondary Color**: `black` (`#000000`)
- **Font**: **Montserrat** – free Google Font, geometric sans‑serif similar to Futura.

### CSS Tokens (defined in `styles/base.css`)

```css
:root {
  /* Colors */
  --color-primary: #718f80;
  --color-primary-dark: #5a6e5e;
  --color-black: #000000;
  --color-bg: #ffffff;
  --color-bg-dark: #111111;

  /* Typography */
  --font-primary: 'Montserrat', sans-serif;
  --font-size-base: clamp(1rem, 1vw + 0.5rem, 1.125rem);
  --line-height-base: 1.5;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 2rem;
}
```

### Core Components (styled in `styles/components.css`)
- **Navbar** – `.navbar` with logo and navigation links.
- **Button** – `.button` and `.button-primary` for call‑to‑action.
- **Hero Section** – `.hero` utility class for centered headline.
- **Card Grid** – `.catalog-grid` (future) for product listings.

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
