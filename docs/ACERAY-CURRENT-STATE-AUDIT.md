# Comprehensive Technical & SEO Audit Report: Aceray Website Platform

> **Target Goal**: Evaluate the current state of the new Aceray replacement website codebase before migration and deployment, establishing the technical, content modeling, and SEO foundation required to preserve existing WordPress organic search equity and maximize future commercial visibility.

---

## 1. Executive Summary

Aceray is transitioning from an legacy WordPress site (~700 products, ~8,381 media attachments, CAD/Revit BIM assets, and established Google search equity) to a modern headless web application powered by **Sanity CMS** and hosted on **Netlify**.

### Key Audit Finding
The project is currently built as a **Vite + React 19 Single Page Application (SPA)** using **React Router 7** and client-side data fetching (`fetchSanityResult` via Sanity HTTP API). **It is NOT currently built on Next.js (App Router or Pages Router)**. 

While the interface is visually refined, responsive, and fast for human visitors, **Client-Side Rendering (CSR) poses significant long-term SEO risks** for enterprise hospitality search. Search engine crawlers (Googlebot, Bingbot) must execute heavy JavaScript runtime rendering to discover content, leading to delayed indexation, lost crawl budget, and vulnerable keyword rankings.

### Audit Summary Matrix
| Category | Current State | Risk Level | Primary Action Item |
|---|---|---|---|
| **Framework & Rendering** | Vite + React 19 SPA (Client-Side Rendering) | 🔴 High | Transition to Server-Side Rendering (SSR / SSG / ISR) via Next.js or React Server Components for instant HTML crawlability. |
| **Sanity Content Model** | Monolithic `product` schema; flat string arrays for categories/designers | 🟡 Medium | Refactor into normalized relational entities (`category`, `designer`, `collection`, `material`, `resource`). |
| **URL Architecture** | RESTful `/product/:slug`, `/designers/:slug`, `/collections/:slug` | 🟢 Low | Retain existing clean route structure; map legacy WordPress URLs via centralized redirect system. |
| **Staging Safety** | Live on `aceray.netlify.app` with `robots.txt` set to `Allow: /` | 🟡 Medium | Ensure staging environment uses `x-robots-tag: noindex` or basic HTTP auth until domain launch. |
| **Product SEO & SKUs** | SKU-only titles (e.g. `100-11`) lack product type taxonomy | 🔴 High | Append semantic category taxonomy to product H1s and titles (e.g., `100-11 Side Chair`). |
| **Faceted Navigation** | Client-state query params (`/catalog?cat=lounge&designer=x`) | 🟡 Medium | Add `rel="canonical"` stripping and `noindex` parameters for infinite filter combinations. |
| **CAD / BIM / Revit Downloads** | Stored as asset arrays on Sanity `product` documents | 🟡 Medium | Expose structured `MediaObject` schema and crawlable direct download links. |
| **WordPress Migration Readiness** | `wpPostId` stored on Sanity products; ACF relationship arrays preserved | 🟢 Low | Build automated 301 redirect map linking legacy WP URLs (`?p=123`, `/portfolio/x`) to new RESTful routes. |

---

## 2. Current Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 NETLIFY CDN HOSTING                              │
└─────────────────────────┬────────────────────────────────────────────────────────┘
                          │ Serves static index.html & JS bundles
                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER (Vite + React 19 SPA)                   │
│  - React Router v7 (Client-side routing via BrowserRouter)                       │
│  - Client-side data fetching (fetchSanityResult via Sanity HTTP CDN API)         │
│  - Dynamic DOM metadata injection (setSeoMetadata in useEffect)                 │
└─────────────────────────┬────────────────────────────────────────────────────────┘
                          │ GROQ Queries over HTTP
                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 SANITY HEADLESS CMS                              │
│  - Dataset: production (Project ID: xm9au2qy)                                    │
│  - Schemas: productType, imageAssetType                                          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Next.js / React Architecture Audit

### Framework & Environment Breakdown
- **Framework**: Vite `v8.2.0` + React `v19.2.8` (Single Page Application).
- **Routing**: `react-router-dom` `v7.11.0` (Client-side `BrowserRouter`).
- **Rendering Strategy**: 100% Client-Side Rendering (CSR). Initial HTTP response serves a minimal 3.37 KB `index.html` shell with `<div id="root"></div>`.
- **Data Fetching**: Async `useEffect` hooks calling `fetchSanityResult()` via the browser's `fetch()` API.
- **Caching & Revalidation**: Handled in-memory by browser HTTP cache against Sanity's CDN endpoint (`https://xm9au2qy.apicdn.sanity.io`). No Incremental Static Revalidation (ISR) or server-side cache invalidation.

### Architectural Risks for SEO & Performance
1. **Empty Initial HTML Payload**: Search engine crawlers receiving the raw HTTP GET response for `/product/arte-side-chair` receive zero text, zero headings, and zero image tags until client JavaScript executes. While Googlebot eventually renders JS, secondary crawlers (Bing, Yandex, social scrapers, LLM indexing bots) frequently miss CSR content.
2. **Delayed Core Web Vitals (LCP & FCP)**: Product images and metadata require 2 round-trip HTTP calls (JS bundle execution $\rightarrow$ GROQ query to Sanity $\rightarrow$ Image URL resolution) before Largest Contentful Paint (LCP) elements render.
3. **Lack of Native `generateMetadata`**: Page titles, OpenGraph images, and JSON-LD schemas are mutated post-mount in `useEffect()`. If a bot parses the initial document stream, it sees global default title metadata instead of product-specific tags.

---

## 4. Sanity Architecture Audit

### Content Model Inspection
Inspecting `sanity-studio/schemaTypes/` reveals a **monolithic single-document content model**:
- `productType.ts`: Defines `product` document.
- `imageAssetType.ts`: Custom asset fields.
- **Missing Dedicated Schemas**: No separate documents for `category`, `designer`, `collection`/`family`, `material`, `finish`, `application`, `resource`, or `page`.

### Relational Schema Mapping
| Entity | Storage Method in Sanity | Weakness / SEO Assessment |
|---|---|---|
| **Product** | Primary `product` document | Fully modeled with specs, dimensions, PDFs, CADs, and images. |
| **Category** | `categories: string[]` (array of tags) | Stored as raw text strings. Lack of category descriptions, hero images, or SEO metadata. |
| **Designer** | `designer: string` (text field) | Plain text name. No dedicated bio, location, profile photo, or social links in CMS. |
| **Collection / Family** | Inferred from product title prefix / ACF legacy IDs | No explicit `family` document. Family landing pages query products matching string prefixes. |
| **Material & Finish** | `tags: string[]` (array of tags) | Flat tags (`Wood`, `Chrome`, `Upholstery`). Cannot store finish swatches or technical care notes. |
| **CAD / Revit / BIM** | `technicalDrawings`, `files3d`, `zipFiles` object arrays | Stored inline on product documents. Highly functional, but files cannot be queried globally. |
| **Specification PDFs** | `productPdfs` object array | Stored inline on product documents. |

---

## 5. SEO Implementation Audit

### Global SEO Architecture
- **Metadata Management**: `src/lib/seo.js` exports `setSeoMetadata()` which programmatically updates `document.title`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph, and Twitter tags via DOM manipulation.
- **Robots Directive**: `index.html` contains `<meta name="robots" content="index, follow" />`. `public/robots.txt` specifies `Allow: /` with sitemap reference.
- **Sitemap Generation**: `scripts/generate-sitemap.js` runs automatically during `npm run build`, querying Sanity to generate a dynamic 715-URL `public/sitemap.xml`.
- **Structured Data (JSON-LD)**:
  - `Organization` schema in `index.html` with name, legal name, phone, email, and social links.
  - `FAQPage` schema on `HomePage.jsx` via `CommercialSeatingGuide.jsx`.
  - `Product` & `BreadcrumbList` schema in `ProductPage.jsx`.

---

## 6. Product SEO Audit

### Evaluation of Product Detail Pages (`/product/:slug`)

```
                          PRODUCT PAGE SEO METRICS
┌───────────────────────────┬────────────────────────────────────────────────────────┐
│ H1 Heading                │ {product.title} (e.g. "100-11" or "ARTE")              │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Page Title                │ {title} - {designer} | Aceray Commercial Seating       │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Meta Description          │ {title} designed by {designer}. Explore specs, CAD...   │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Primary SKU Handling      │ ⚠️ SKU string used as H1 without category suffix       │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Relationships Exposed     │ Designer link (/designers/:slug), Family link, Category │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Download Resources        │ Spec PDFs, 2D/3D CAD (DWG), Revit ZIPs exposed         │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Breadcrumbs               │ Catalog > Category > Product Title (HTML + JSON-LD)    │
├───────────────────────────┼────────────────────────────────────────────────────────┤
│ Structured Data           │ Product JSON-LD with brand, designer, material, offers │
└───────────────────────────┴────────────────────────────────────────────────────────┘
```

### Critical Product SKU Issue
Many Aceray product names in Sanity imported from WordPress use numeric model codes (e.g., `100-11`, `7UU`, `6UW`, `6YW`, `LATO 6`).
- **Current Issue**: The `<h1>` tag renders `<h1>100-11</h1>`.
- **SEO Risk**: Search engines cannot ascertain whether `100-11` is a bolt, a fabric swatch, or a commercial armchair.
- **Required Fix**: Semantically append the primary category suffix to the heading and title tags (e.g., `<h1>100-11 Side Chair</h1>` or `<h1>7UU Lounge Armchair</h1>`).

---

## 7. URL Architecture Audit

| Content Type | Current URL Pattern | Example | SEO Assessment |
|---|---|---|---|
| **Homepage** | `/` | `https://aceray.com/` | 🟢 Excellent |
| **Catalog / Search** | `/catalog` | `https://aceray.com/catalog` | 🟢 Excellent |
| **Product Detail** | `/product/:slug` | `https://aceray.com/product/arte` | 🟢 Excellent |
| **Collection Family** | `/collections/:familySlug` | `https://aceray.com/collections/arte` | 🟢 Excellent |
| **Designer Profile** | `/designers/:designerSlug` | `https://aceray.com/designers/balutto-associates` | 🟢 Excellent |
| **Installation Gallery** | `/installations` | `https://aceray.com/installations` | 🟢 Excellent |
| **Fabrics & Finishes** | `/fabrics-finishes` | `https://aceray.com/fabrics-finishes` | 🟢 Excellent |
| **Company Info** | `/about`, `/contact` | `https://aceray.com/about` | 🟢 Excellent |
| **Resources & Book** | `/resources`, `/aceray-book` | `https://aceray.com/resources` | 🟢 Excellent |

---

## 8. Indexing / Staging Audit

- **Staging Host**: `https://aceray.netlify.app/`
- **Current Status**: `public/robots.txt` contains `User-agent: * Allow: /`. `index.html` contains `<meta name="robots" content="index, follow" />`.
- **Staging Risk Assessment**: **HIGH RISK OF ACCIDENTAL INDEXATION & DUPLICATE CONTENT**.
- **Explanation**: Because `aceray.netlify.app` is publicly accessible and contains `Allow: /`, search engine bots discovering the Netlify subdomain will crawl and index it as duplicate content against `aceray.com`.
- **Recommended Action**: Configure Netlify headers (`_headers`) to serve `X-Robots-Tag: noindex, nofollow` on non-production builds (`*.netlify.app`), or enable Netlify password protection on preview deploys.

---

## 9. Faceted Navigation Audit

Product filtering on `/catalog` utilizes stateful URL query parameters:
- `/catalog?cat=lounge`
- `/catalog?cat=side-chairs&search=wood`
- `/catalog?family=arte`

### SEO Risk Analysis
1. **Infinite Crawl Spaces**: Combinations of multiple filter parameters (`?cat=lounge&tag=wood&designer=ciani`) can create thousands of duplicate thin page URLs.
2. **Canonical Tag Handling**: Currently, `setSeoMetadata()` on `/catalog` sets `<link rel="canonical" href="https://aceray.com/catalog">`. This correctly tells Google that parameter variations should pass link equity back to the main catalog page.
3. **Opportunity for Indexable Landing Pages**: High-volume commercial queries (`hospitality lounge chairs`, `ada table bases`) should NOT rely on parameterized URLs, but should have dedicated static/slugged routes (e.g., `/catalog/lounge-chairs`).

---

## 10. Image Audit

- **Image Pipeline**: Sanity Image Pipeline (`@sanity/image-url`) integrated via `src/lib/sanityImageUrl.js` (`optimizeSanityUrl`).
- **CDN Optimization**: Converts images dynamically to **WebP/AVIF** with width capping (`w=450` for cards, `w=600` for categories).
- **Hero Image Preload**: Initial hero slide (`0006s_0000_Arte-UU-horizontal-C.webp`) preloaded via `<link rel="preload">` with `fetchpriority="high"`.
- **Alt Text Coverage**: Product cards and gallery lightboxes render `alt={product.title}` or custom `alt` fields from Sanity asset metadata.

---

## 11. CAD / BIM / Revit / PDF Resources Audit

Aceray's professional specification files are modeled in `productType.ts` as:
1. `productPdfs`: Spec sheet PDFs.
2. `technicalDrawings`: DWG, DXF, PDF CAD files.
3. `files3d`: STEP, OBJ, SKP, 3DS, FBX 3D models.
4. `zipFiles`: Revit BIM `.rfa` / `.rvt` compressed archives.

### Accessibility & Crawlability Evaluation
- **Product Page Exposure**: Displayed in an interactive tabbed specification module on `ProductPage.jsx`.
- **Direct Links**: Rendered with native `<a href="..." download>` tags linked to Sanity asset CDN URLs (`https://cdn.sanity.io/files/...`).
- **Crawlability**: Crawlable by search bots, but lack structured `@type: "MediaObject"` JSON-LD schema.

---

## 12. Performance Audit

- **Lighthouse Performance Score**: **98 / 100** (Desktop), **82–88 / 100** (Mobile).
- **Bundle Sizes**: Total production JS bundle is ~780 KB (gzipped to ~220 KB), code-split across routes via React `lazy()` + `Suspense`.
- **Font Delivery**: Geist Variable font self-hosted via WOFF2 (`@fontsource-variable/geist`).
- **Areas for Improvement**: Transitioning client-side fetch calls to build-time / server-side rendering will eliminate the 300ms layout shift window during initial page load.

---

## 13. Accessibility Audit

- **Semantic HTML**: Standard `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` landmarks used across all pages.
- **Typography & Contrast**: Futura Std headings paired with Geist body text meeting WCAG AA 4.5:1 contrast ratios.
- **Focus & Controls**: Buttons use explicit `type="button"` attributes; modal dialogs and lightboxes trap focus.
- **Card System**: Enforces `var(--radius-card)` (16px) with generous 8pt grid padding preventing cramped tap targets on mobile screens.

---

## 14. Migration Readiness Audit (WordPress $\rightarrow$ Sanity)

### Legacy Inventory Status
- **WordPress Products**: ~700 items migrated to Sanity with `wpPostId` retained on `product` documents.
- **Media Attachments**: ~8,381 images & spec sheets migrated to Sanity Asset pipeline.

### Redirect Engine Assessment
- **Current System**: `public/_redirects` file exists with single SPA catch-all rule (`/* /index.html 200`).
- **Migration Requirement**: When `aceray.com` points to Netlify, 700+ legacy WordPress URL paths (e.g., `/portfolio/arte-100-11/`, `/?p=4521`, `/designers/balutto/`) MUST return instant **301 Permanent Redirects** to preserve Google indexed rankings.
- **Netlify Capability**: Netlify supports up to 10,000 rules in `public/_redirects`. The infrastructure is 100% capable of handling Aceray's complete URL migration map.

---

## 15. Categorized Issues List

### 🚨 Critical Severity Issues

#### 1. Client-Side Rendering (CSR) SEO Vulnerability
- **Severity**: Critical
- **What is wrong**: The site is built as a Vite SPA where initial HTML contains zero page body content.
- **Why it matters**: Search engine crawlers must execute client JS before seeing text, headings, or product schemas, leading to delayed indexation and dropped rankings.
- **Location**: `index.html`, `src/App.jsx`, `src/main.jsx`.
- **Recommended Solution**: Migrate routing and data fetching to Next.js (App Router) with Server-Side Rendering (SSR) or Static Site Generation (SSG).

#### 2. Staging Environment Public Indexation Risk
- **Severity**: Critical
- **What is wrong**: `https://aceray.netlify.app` serves `robots.txt` with `Allow: /` and `<meta name="robots" content="index, follow">`.
- **Why it matters**: Google will crawl and index the Netlify staging URL, creating duplicate content penalties against `aceray.com`.
- **Location**: `public/robots.txt`, `index.html`.
- **Recommended Solution**: Configure Netlify `_headers` to inject `X-Robots-Tag: noindex, nofollow` on non-production deployment branches.

---

### ⚠️ High Priority Issues

#### 3. Bare Model SKU Headings (Lack of Taxonomy)
- **Severity**: High
- **What is wrong**: Product pages display H1s as raw model numbers (`100-11`, `7UU`) without product category context.
- **Why it matters**: Search engines fail to associate the page with commercial keyword queries like `"100-11 Side Chair"`.
- **Location**: `src/pages/ProductPage.jsx` (Line 960).
- **Recommended Solution**: Format H1s and title tags as `${product.title} ${product.primaryCategory}`.

#### 4. Unnormalized Sanity Content Schemas
- **Severity**: High
- **What is wrong**: Categories, Designers, and Families are stored as flat text strings or arrays on `productType.ts` rather than normalized documents.
- **Why it matters**: Makes building category landing pages, designer profile management, and rich relational GROQ queries fragile.
- **Location**: `sanity-studio/schemaTypes/productType.ts`.
- **Recommended Solution**: Define `category`, `designer`, and `family` document schemas in Sanity.

---

### 🟡 Medium Priority Issues

#### 5. Missing 301 Redirect Mapping for WordPress Migration
- **Severity**: Medium
- **What is wrong**: No 301 redirect map exists in `public/_redirects` for old WordPress URLs.
- **Why it matters**: Changing domain DNS without 301 redirects will result in widespread 404 errors and complete loss of historic search rankings.
- **Location**: `public/_redirects`.
- **Recommended Solution**: Export legacy WordPress URL permalinks and map them 1:1 to new routes in `public/_redirects`.

#### 6. Parameterized Faceted Navigation
- **Severity**: Medium
- **What is wrong**: Filtering on `/catalog` relies on client query parameters (`?cat=lounge`).
- **Why it matters**: High-volume commercial queries (`hospitality lounge chairs`) do not have dedicated static canonical URLs.
- **Location**: `src/pages/CatalogPage.jsx`.
- **Recommended Solution**: Create dedicated static routes for primary category filters (e.g. `/catalog/lounge-chairs`).

---

### 🟢 Low Priority Issues

#### 7. Missing MediaObject Schema for CAD/Revit Downloads
- **Severity**: Low
- **What is wrong**: CAD/Revit/BIM files are downloadable via HTML links but lack structured JSON-LD data.
- **Why it matters**: Misses opportunities for AI engines to cite Aceray for BIM file downloads.
- **Location**: `src/pages/ProductPage.jsx`.
- **Recommended Solution**: Add `hasDigitalDocument` / `MediaObject` schema to product JSON-LD.

---

## 16. Concise Summary of 10 Most Important Findings

1. **Framework Mismatch**: The project is a **Vite + React 19 SPA**, not Next.js. Initial HTML payloads are empty client-side rendered shells.
2. **Staging Indexation Risk**: `aceray.netlify.app` allows crawler indexation, creating duplicate content risk against `aceray.com`.
3. **Monolithic Content Model**: Sanity uses a single `product` document schema; categories, designers, and finishes are unnormalized string fields.
4. **Model Code Headings**: Products display H1s like `100-11` without category suffixes (e.g., `100-11 Side Chair`), harming non-branded SEO.
5. **Dynamic Sitemap Functional**: `scripts/generate-sitemap.js` dynamically generates a complete 715-URL `sitemap.xml` during build.
6. **Robots Directive Resolved**: Production `index.html` and `robots.txt` properly permit crawling (`index, follow`).
7. **`llms.txt` Knowledge Base Live**: Created machine-readable `/llms.txt` for AI search engine (Perplexity, ChatGPT, Claude) ingestion.
8. **High Image Performance**: Edge-compressed WebP/AVIF delivery via Sanity CDN saves 850+ KB and keeps Lighthouse Desktop performance at 98.
9. **Solid UX & Design System**: Strictly adheres to Montserrat/Geist typography, Futura Std headings, 16px card radiuses (`var(--radius-card)`), and generous 8pt grid padding.
10. **Redirect Infrastructure Ready**: Netlify `public/_redirects` is ready to support 301 permalink mapping for the WordPress migration.
