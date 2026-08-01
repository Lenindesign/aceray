# APP_GUIDE.md

## Quick Start Guide for the Aceray Vite Project

### Prerequisites
- **Node.js** (v18 or newer) – install from https://nodejs.org/
- **npm** (comes bundled with Node)
- Internet connection (to pull the Google Font and the logo SVG)

### Installation
```bash
# Clone the repo (if you haven't already)
git clone https://github.com/Lenindesign/aceray .

# Install dependencies
npm install
```
> The `npm install` step adds Vite (`vite@^5.3.0`) and creates `node_modules`.

### Development
```bash
npm run dev
```
- Vite starts a development server at `http://localhost:5173` (or another port if it’s busy).
- The site hot‑reloads whenever you edit source files under `src/`, `styles/`, or any HTML pages.

### Building for Production
```bash
npm run build
```
- Generates an optimized bundle in the `dist/` directory.
- Files are minified, hashed, and ready for static hosting (GitHub Pages, Firebase Hosting, Netlify, etc.).

### Preview Production Build
```bash
npm run preview
```
- Spins up a local preview server to test the production bundle.

### Project Structure
```
/ (project root)
├─ index.html          # Home page
├─ about.html          # About page
├─ catalog.html        # Product catalog page (placeholder)
├─ contact.html        # Contact page (placeholder)
├─ assets/
│   └─ images/
│       └─ logo.svg   # Aceray logo (downloaded automatically)
├─ styles/
│   ├─ base.css       # Design‑system tokens (colors, fonts, spacing)
│   └─ components.css# Component‑level styles (navbar, buttons, cards)
├─ src/
│   └─ main.js        # Entry point for Vite (currently empty)
├─ package.json        # Scripts and devDependencies (vite)
└─ STYLE_GUIDE.md      # Design‑system reference (see above)
└─ APP_GUIDE.md        # This quick‑start guide
```

### Adding New Pages / Components
1. **Create a new HTML file** in the root (e.g., `services.html`).
2. **Link the CSS**:
   ```html
   <link rel="stylesheet" href="/styles/base.css" />
   <link rel="stylesheet" href="/styles/components.css" />
   ```
3. **Add a route** – Vite serves any `.html` file at its filename, so no extra routing is needed for a static site.

### IDE Integration
- Open the project folder in any IDE (VS Code, WebStorm, Sublime, etc.).
- The `STYLE_GUIDE.md` and `APP_GUIDE.md` files sit in the repository root, so they are searchable and viewable directly from the IDE’s file explorer.
- You can also enable the IDE’s markdown preview to read the guides while coding.

---

*Generated for the Aceray redesign – placed in the repository root for universal IDE visibility.*
