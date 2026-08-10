import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import {readProductSlug} from '../../scripts/taxonomy-utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../..')
const transformedDir = path.join(rootDir, 'migration', 'transformed')
const reportsDir = path.join(rootDir, 'migration', 'reports')

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return []
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message)
}

const products = readNdjson(path.join(transformedDir, 'products-normalized.ndjson'))
const designers = readNdjson(path.join(transformedDir, 'designers.ndjson'))
const families = readNdjson(path.join(transformedDir, 'families.ndjson'))
const productCategories = readNdjson(path.join(transformedDir, 'product-categories.ndjson'))
const sourceProducts = readNdjson(path.join(rootDir, 'sanity-products.ndjson'))
const reportPath = path.join(reportsDir, 'taxonomy-readiness-report.json')
const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml')
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : ''

const failures = []
const warnings = []

assert(products.length === sourceProducts.length, `Expected ${sourceProducts.length} normalized products, found ${products.length}`, failures)
assert(designers.length > 0, 'Designer document stream is empty', failures)
assert(families.length > 0, 'Collection document stream is empty', failures)
assert(productCategories.length === 9, `Expected 9 product categories, found ${productCategories.length}`, failures)
assert(Boolean(report), 'Missing taxonomy-readiness-report.json', failures)

const slugs = new Set()
const duplicateSlugs = []
for (const product of products) {
  const slug = readProductSlug(product)
  if (!slug) continue
  if (slugs.has(slug)) duplicateSlugs.push(slug)
  slugs.add(slug)
}

assert(duplicateSlugs.length === 0, `Duplicate product slugs: ${duplicateSlugs.join(', ')}`, failures)
assert(!slugs.has('test'), 'Non-product slug "test" is present in normalized product output', failures)

const designerIds = new Set(designers.map((doc) => doc._id))
const familyIds = new Set(families.map((doc) => doc._id))
const categoryIds = new Set(productCategories.map((doc) => doc._id))
const unresolved = {
  designerRefs: products.filter((product) => product.designerRef && !designerIds.has(product.designerRef._ref)).length,
  familyRefs: products.filter((product) => product.familyRef && !familyIds.has(product.familyRef._ref)).length,
  productTypeRefs: products.filter((product) => product.productTypeRef && !categoryIds.has(product.productTypeRef._ref)).length,
}

assert(unresolved.designerRefs === 0, `${unresolved.designerRefs} product designer refs do not resolve`, failures)
assert(unresolved.familyRefs === 0, `${unresolved.familyRefs} product collection refs do not resolve`, failures)
assert(unresolved.productTypeRefs === 0, `${unresolved.productTypeRefs} product category refs do not resolve`, failures)

if (report?.missing?.family) warnings.push(`${report.missing.family} products need editorial family review`)
if (report?.missing?.productType) warnings.push(`${report.missing.productType} products need product type review`)
if (report?.missing?.designer) warnings.push(`${report.missing.designer} products are missing designer`)
if (report?.missing?.image) warnings.push(`${report.missing.image} products are missing image data`)

if (sitemap) {
  assert(
    sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9'),
    'Sitemap namespace is not the official sitemaps.org namespace',
    failures
  )
  assert(!sitemap.includes('/product/test<'), 'Sitemap includes /product/test', failures)
  assert(sitemap.includes('/collections/nota<'), 'Sitemap is missing /collections/nota', failures)
  assert(sitemap.includes('/designers/'), 'Sitemap is missing designer detail URLs', failures)
}

console.log('Migration readiness validation')
console.log(`Products: ${products.length}`)
console.log(`Designers: ${designers.length}`)
console.log(`Collections: ${families.length}`)
console.log(`Product categories: ${productCategories.length}`)
console.log(`Warnings: ${warnings.length ? warnings.join('; ') : 'none'}`)

if (failures.length > 0) {
  console.error(`Failures:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log('No hard migration readiness failures found')
