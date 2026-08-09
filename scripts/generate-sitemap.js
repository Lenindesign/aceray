import fs from 'node:fs'
import path from 'node:path'

const SITE_URL = process.env.SITE_URL || 'https://aceray.com'
const PRODUCTS_FILE = path.resolve('sanity-products.ndjson')
const SITEMAP_FILE = path.resolve('public/sitemap.xml')

const CATEGORIES = [
  'Side Chairs',
  'Armchairs',
  'Lounge Seating',
  'Barstools',
  'Counter Stools',
  'Low Stools / Ottomans',
  'Benches',
  'Tables & Bases',
  'Outdoors',
]

const CATEGORY_SLUGS = {
  'Low Stools / Ottomans': 'low-stools-ottomans',
  'Tables & Bases': 'tables-bases',
  Outdoors: 'outdoors',
}

const FAMILY_HERO_SLUGS = [
  'alba',
  'almea',
  'ampio',
  'arte',
  'asta',
  'ballo',
  'bora',
  'ciao',
  'corso',
  'forte',
  'gala',
  'libro',
  'mira',
  'nota',
  'riva',
  'solo',
  'spazio',
  'tana',
]

const NON_FAMILY_CATEGORIES = new Set([
  ...CATEGORIES,
  'Aurea',
  'Benches RTS',
  'Chrome',
  'Chrome + Black',
  'Extrema Metal',
  'Lounge Seating RTS',
  'Matte + Chrome',
  'Family',
  'Materials',
  'Planet',
  'Products',
  'Ready to Ship',
  'Side Chairs RTS',
  'Skill',
  'Stacking 2-Seater',
  'Stacking Chair',
  'Tables',
  'Tables RTS',
  'Uncategorized',
  'Upholstery',
  "What's New",
  'Wood',
])

const GENERIC_FAMILY_CATEGORY_PATTERN = /\b(armchair|barstool|base|bench|chair|chrome|counter|dining|height|indoor|lounge|material|modular|ottoman|outdoor|powder|product|rocker|seat|sofa|stacking|stool|swivel|table|tilt|top|wood)\b/i

function getCategorySlug(category) {
  return CATEGORY_SLUGS[category] || category.toLowerCase().replace(/\s+/g, '-')
}

function getSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return []

  return fs.readFileSync(PRODUCTS_FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function productSlug(product) {
  return typeof product.slug === 'string' ? product.slug : product.slug?.current
}

function getProductFamilies(product) {
  const families = new Set()
  const categories = product.categories || []

  categories.forEach((category) => {
    if (
      !category ||
      NON_FAMILY_CATEGORIES.has(category) ||
      /[(),]/.test(category) ||
      /\bRTS\b/i.test(category) ||
      /^Stacking\b/i.test(category) ||
      GENERIC_FAMILY_CATEGORY_PATTERN.test(category) ||
      /\d/.test(category)
    ) {
      return
    }

    const slug = getSlug(category)
    if (/^[a-z][a-z0-9-]*$/.test(slug)) families.add(slug)
  })

  return Array.from(families).filter(Boolean)
}

function toAbsoluteUrl(route) {
  return new URL(route, SITE_URL).toString()
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function addUrl(urls, route, changefreq = 'weekly', priority = '0.7') {
  const absoluteUrl = toAbsoluteUrl(route)

  if (urls.has(absoluteUrl)) return
  urls.set(absoluteUrl, { loc: absoluteUrl, changefreq, priority })
}

const products = readProducts()
const urls = new Map()
const designerSlugs = new Set()
const familySlugs = new Set(FAMILY_HERO_SLUGS)

addUrl(urls, '/', 'daily', '1.0')
addUrl(urls, '/catalog', 'daily', '0.9')
addUrl(urls, '/collections', 'weekly', '0.8')
addUrl(urls, '/designers', 'weekly', '0.8')
addUrl(urls, '/installations', 'weekly', '0.8')
addUrl(urls, '/fabrics-finishes', 'monthly', '0.7')
addUrl(urls, '/resources', 'monthly', '0.7')
addUrl(urls, '/aceray-book', 'monthly', '0.7')
addUrl(urls, '/blog', 'monthly', '0.6')
addUrl(urls, '/about', 'monthly', '0.6')
addUrl(urls, '/contact', 'monthly', '0.6')
addUrl(urls, '/catalog?new=1', 'daily', '0.8')
addUrl(urls, '/catalog?cat=ready-to-ship', 'daily', '0.8')

CATEGORIES.forEach((category) => {
  addUrl(urls, `/catalog?cat=${getCategorySlug(category)}`, 'daily', '0.8')
})

products.forEach((product) => {
  const slug = productSlug(product)
  if (slug) addUrl(urls, `/product/${slug}`, 'weekly', '0.7')

  if (product.designer) designerSlugs.add(getSlug(product.designer))

  getProductFamilies(product).forEach((familySlug) => {
    familySlugs.add(familySlug)
  })
})

Array.from(familySlugs).sort().forEach((familySlug) => {
  addUrl(urls, `/collections/${familySlug}`, 'weekly', '0.8')
})

Array.from(designerSlugs).sort().forEach((designerSlug) => {
  addUrl(urls, `/designers/${designerSlug}`, 'monthly', '0.7')
})

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Array.from(urls.values()).map(({ loc, changefreq, priority }) => [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync(SITEMAP_FILE, xml)

console.log(`Generated ${SITEMAP_FILE} with ${urls.size} URLs from ${products.length} products.`)
