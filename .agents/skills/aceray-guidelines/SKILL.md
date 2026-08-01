---
name: aceray-guidelines
description: Enforces the Aceray project guidelines from STYLE_GUIDE.md and APP_GUIDE.md. Use whenever modifying layout, styling, HTML structure, or site components in the Aceray codebase.
---

# Aceray Project Guidelines Skill

Always adhere strictly to the guidelines defined in the project's root files:
- [STYLE_GUIDE.md](file:///Users/leninaviles/Projects/Aceray/STYLE_GUIDE.md)
- [APP_GUIDE.md](file:///Users/leninaviles/Projects/Aceray/APP_GUIDE.md)

## Core Architectural & Design Principles

### 1. Design System & CSS Tokens
- **Primary Color**: `#718f80` (`--color-primary`)
- **Primary Dark**: `#5a6e5e` (`--color-primary-dark`)
- **Secondary / Text**: `#000000` (`--color-black`)
- **Background**: `#ffffff` (`--color-bg`), Dark: `#111111` (`--color-bg-dark`)
- **Typography**: Montserrat (`--font-primary: 'Montserrat', sans-serif`)
- **Spacing Scale**: `--space-1` (0.25rem), `--space-2` (0.5rem), `--space-3` (1rem), `--space-4` (2rem)

### 2. Stylesheet Structure
- Always maintain and import CSS files in HTML headers:
  ```html
  <link rel="stylesheet" href="/styles/base.css" />
  <link rel="stylesheet" href="/styles/components.css" />
  ```
- Keep design system tokens in `styles/base.css`.
- Keep component styles (`.navbar`, `.button`, `.button-primary`, `.hero`, cards) in `styles/components.css`.

### 3. Accessibility & Structure
- Use HTML5 semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Ensure contrast ratio meets WCAG AA standards (minimum 4.5:1).
- Provide descriptive `alt` text for all images.

### 4. Page Creation & Routing
- Create static HTML files in the project root (e.g. `index.html`, `catalog.html`, `about.html`, `contact.html`).
- Ensure all pages link entry point JS if needed: `<script type="module" src="/src/main.js"></script>`.
