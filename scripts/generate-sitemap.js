import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ID = 'xm9au2qy'
const DATASET = 'production'
const API_VERSION = '2023-08-01'
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

async function generateSitemap() {
  console.log('Generating dynamic sitemap.xml from Sanity CMS...')

  const today = new Date().toISOString().split('T')[0]

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/catalog', priority: '0.9', changefreq: 'daily' },
    { url: '/collections', priority: '0.8', changefreq: 'weekly' },
    { url: '/designers', priority: '0.8', changefreq: 'weekly' },
    { url: '/installations', priority: '0.8', changefreq: 'weekly' },
    { url: '/fabrics-finishes', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/aceray-book', priority: '0.6', changefreq: 'monthly' },
    { url: '/resources', priority: '0.6', changefreq: 'monthly' },
  ]

  let productSlugs = []
  let designerSlugs = []
  let familySlugs = []

  try {
    const products = await fetchSanityQuery(`*[_type == "product" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`)
    productSlugs = products.map((p) => ({
      url: `/product/${p.slug}`,
      lastmod: p._updatedAt ? p._updatedAt.split('T')[0] : today,
      priority: '0.8',
      changefreq: 'weekly',
    }))
  } catch (err) {
    console.warn('Failed to fetch product slugs for sitemap:', err.message)
  }

  try {
    const designers = await fetchSanityQuery(`*[_type == "designer" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`)
    designerSlugs = designers.map((d) => ({
      url: `/designers/${d.slug}`,
      lastmod: d._updatedAt ? d._updatedAt.split('T')[0] : today,
      priority: '0.7',
      changefreq: 'weekly',
    }))
  } catch (err) {
    console.warn('Failed to fetch designer slugs for sitemap:', err.message)
  }

  try {
    const families = await fetchSanityQuery(`*[_type == "family" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`)
    familySlugs = families.map((f) => ({
      url: `/collections/${f.slug}`,
      lastmod: f._updatedAt ? f._updatedAt.split('T')[0] : today,
      priority: '0.7',
      changefreq: 'weekly',
    }))
  } catch (err) {
    console.warn('Failed to fetch family slugs for sitemap:', err.message)
  }

  const allEntries = [
    ...staticRoutes.map((r) => ({ ...r, lastmod: today })),
    ...productSlugs,
    ...designerSlugs,
    ...familySlugs,
  ]

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${BASE_URL}${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
  fs.writeFileSync(outputPath, sitemapXml, 'utf8')
  console.log(`Successfully generated sitemap.xml with ${allEntries.length} URLs at ${outputPath}`)
}

generateSitemap().catch((err) => {
  console.error('Error generating sitemap:', err)
  process.exit(1)
})
