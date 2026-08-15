import fs from 'fs'
import path from 'path'
import https from 'https'
import {fileURLToPath} from 'url'
import {
  FAMILY_HERO_IMAGES,
  PRODUCT_TYPES,
  getDesignerDocSlug,
  getFamily,
  getProductTypeSlug,
  normalizeDesigner,
  readProductSlug,
  slugify,
  unique,
} from './taxonomy-utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

const PROJECT_ID = 'xm9au2qy'
const DATASET = 'production'
const API_VERSION = '2026-08-09'
const BASE_URL = 'https://aceray.com'

function fetchSanityQuery(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query)
    const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodedQuery}`

    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Sanity responded with ${res.statusCode}`))
            return
          }

          try {
            const parsed = JSON.parse(data)
            resolve(parsed.result || [])
          } catch (err) {
            reject(err)
          }
        })
      })
      .on('error', (err) => reject(err))
  })
}

function readNdjsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return []
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function formatDate(value, fallback) {
  return value ? value.split('T')[0] : fallback
}

function entry(url, today, priority, changefreq, lastmod = today) {
  return {url, lastmod, priority, changefreq}
}

function dedupeEntries(entries) {
  const byUrl = new Map()
  for (const item of entries) {
    if (!item.url || byUrl.has(item.url)) continue
    byUrl.set(item.url, item)
  }
  return [...byUrl.values()].sort((left, right) => left.url.localeCompare(right.url))
}

function getLocalProducts() {
  const normalizedPath = path.join(rootDir, 'migration', 'transformed', 'products-normalized.ndjson')
  const sourcePath = path.join(rootDir, 'sanity-products.ndjson')
  const normalizedProducts = readNdjsonIfExists(normalizedPath)
  return normalizedProducts.length > 0 ? normalizedProducts : readNdjsonIfExists(sourcePath)
}

function buildLocalProductEntries(products, today) {
  return products
    .map((product) => readProductSlug(product))
    .filter((slug) => slug && slug !== 'test')
    .sort((left, right) => left.localeCompare(right))
    .map((slug) => entry(`/product/${slug}`, today, '0.8', 'weekly'))
}

function buildLocalDesignerEntries(products, today) {
  return unique(products.map((product) => normalizeDesigner(product.designer)))
    .map((designer) => getDesignerDocSlug(designer))
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right))
    .map((slug) => entry(`/designers/${slug}`, today, '0.7', 'weekly'))
}

function buildLocalFamilyEntries(products, today) {
  const productFamilies = products.map((product) => slugify(getFamily(product))).filter(Boolean)
  const heroFamilies = Object.keys(FAMILY_HERO_IMAGES)
  return unique([...productFamilies, ...heroFamilies])
    .sort((left, right) => left.localeCompare(right))
    .map((slug) => entry(`/collections/${slug}`, today, '0.7', 'weekly'))
}

async function safeFetchEntries(label, query, toEntry, fallbackEntries) {
  try {
    const docs = await fetchSanityQuery(query)
    const entries = docs.map(toEntry).filter((item) => item?.url)
    if (entries.length > 0) return entries
    console.warn(`Sanity returned no ${label}; using local fallback`)
  } catch (err) {
    console.warn(`Failed to fetch ${label} for sitemap; using local fallback: ${err.message}`)
  }

  return fallbackEntries
}

async function generateSitemap() {
  console.log('Generating sitemap.xml...')

  const today = new Date().toISOString().split('T')[0]
  const localProducts = getLocalProducts()

  const staticRoutes = [
    entry('/', today, '1.0', 'daily'),
    entry('/catalog', today, '0.9', 'daily'),
    entry('/collections', today, '0.8', 'weekly'),
    entry('/designers', today, '0.8', 'weekly'),
    entry('/installations', today, '0.8', 'weekly'),
    entry('/fabrics-finishes', today, '0.7', 'monthly'),
    entry('/about', today, '0.6', 'monthly'),
    entry('/contact', today, '0.7', 'monthly'),
    entry('/aceray-book', today, '0.6', 'monthly'),
    entry('/resources', today, '0.6', 'monthly'),
    entry('/blog', today, '0.5', 'monthly'),
  ]

  const categoryRoutes = PRODUCT_TYPES.map((category) => (
    entry(`/catalog?cat=${getProductTypeSlug(category)}`, today, '0.7', 'weekly')
  ))

  const productEntries = await safeFetchEntries(
    'product slugs',
    `*[_type == "product" && defined(slug.current) && slug.current != "test"]{ "slug": slug.current, _updatedAt }`,
    (product) => entry(`/product/${product.slug}`, today, '0.8', 'weekly', formatDate(product._updatedAt, today)),
    buildLocalProductEntries(localProducts, today)
  )

  const designerDocs = await fetchSanityQuery(
    `*[_type == "product" && defined(designer) && designer != ""]{ designer, _updatedAt }`
  ).catch(() => [])

  const designerSlugs = unique(
    designerDocs.map((doc) => getDesignerDocSlug(normalizeDesigner(doc.designer)))
  ).filter(Boolean)

  const designerEntries = designerSlugs.length > 0
    ? designerSlugs.map((slug) => entry(`/designers/${slug}`, today, '0.7', 'weekly'))
    : buildLocalDesignerEntries(localProducts, today)

  const familyDocs = await fetchSanityQuery(
    `*[_type == "product" && defined(categories)]{ categories, title, "slug": slug.current, _updatedAt }`
  ).catch(() => [])

  const familySlugs = unique([
    ...familyDocs.map((doc) => slugify(getFamily(doc))).filter(Boolean),
    ...Object.keys(FAMILY_HERO_IMAGES),
  ])

  const familyEntries = familySlugs.length > 0
    ? familySlugs.map((slug) => entry(`/collections/${slug}`, today, '0.7', 'weekly'))
    : buildLocalFamilyEntries(localProducts, today)

  const blogPostEntries = await safeFetchEntries(
    'blog post slugs',
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`,
    (post) => entry(`/blog/${post.slug}`, today, '0.7', 'weekly', formatDate(post._updatedAt, today)),
    [
      entry('/blog/engineering-commercial-seating-beechwood-vs-metal', today, '0.7', 'weekly'),
      entry('/blog/demystifying-double-rub-ratings-contract-upholstery', today, '0.7', 'weekly'),
      entry('/blog/designing-high-turn-restaurant-dining-spaces', today, '0.7', 'weekly'),
    ]
  )

  const allEntries = dedupeEntries([
    ...staticRoutes,
    ...categoryRoutes,
    ...productEntries,
    ...designerEntries,
    ...familyEntries,
    ...blogPostEntries,
  ])

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (item) => `  <url>
    <loc>${BASE_URL}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  const outputPath = path.join(rootDir, 'public', 'sitemap.xml')
  fs.writeFileSync(outputPath, sitemapXml, 'utf8')
  console.log(`Successfully generated sitemap.xml with ${allEntries.length} URLs at ${outputPath}`)
}

generateSitemap().catch((err) => {
  console.error('Error generating sitemap:', err)
  process.exit(1)
})
