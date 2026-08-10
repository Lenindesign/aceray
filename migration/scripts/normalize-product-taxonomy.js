import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import {
  FAMILY_HERO_IMAGES,
  PRODUCT_TYPES,
  cleanText,
  getDesignerDocSlug,
  getDesignerProfileData,
  getFamily,
  getFeatures,
  getMaterials,
  getProductType,
  getProductTypeSlug,
  normalizeDesigner,
  readProductSlug,
  slugify,
  unique,
} from '../../scripts/taxonomy-utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../..')
const inputPath = path.join(rootDir, 'sanity-products.ndjson')
const transformedDir = path.join(rootDir, 'migration', 'transformed')
const reportsDir = path.join(rootDir, 'migration', 'reports')

function readNdjson(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

function writeNdjson(filePath, docs) {
  fs.writeFileSync(filePath, `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`, 'utf8')
}

function increment(map, key, amount = 1) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + amount)
}

function addToSetMap(map, key, value) {
  if (!key || !value) return
  if (!map.has(key)) map.set(key, new Set())
  map.get(key).add(value)
}

function ref(type, slug) {
  return slug ? {_type: 'reference', _ref: `${type}-${slug}`} : undefined
}

function normalizeProduct(product) {
  const family = getFamily(product)
  const productType = getProductType(product)
  const designer = normalizeDesigner(product.designer)
  const materials = getMaterials(product)
  const features = getFeatures(product)
  const familySlug = slugify(family)
  const productTypeSlug = getProductTypeSlug(productType)
  const designerSlug = getDesignerDocSlug(designer)
  const normalized = {
    ...product,
    designer: designer || product.designer,
    family,
    productType,
    materials,
    features,
    legacyCategories: unique(product.categories || []),
    legacyTags: unique(product.tags || []),
  }

  if (designerSlug) normalized.designerRef = ref('designer', designerSlug)
  if (familySlug) normalized.familyRef = ref('family', familySlug)
  if (productTypeSlug) normalized.productTypeRef = ref('product-category', productTypeSlug)

  if ((product.categories || []).some((category) => cleanText(category) === "What's New")) {
    normalized.isNewArrival = true
  }

  return normalized
}

function createDesignerDocs(products) {
  const bySlug = new Map()

  for (const product of products) {
    const name = normalizeDesigner(product.designer)
    const slug = getDesignerDocSlug(name)
    if (!name || !slug) continue

    if (!bySlug.has(slug)) {
      const profile = getDesignerProfileData(name) || {}
      bySlug.set(slug, {
        _id: `designer-${slug}`,
        _type: 'designer',
        name,
        slug: {_type: 'slug', current: slug},
        ...(profile.bio ? {bio: profile.bio} : {}),
        ...(profile.location ? {location: profile.location} : {}),
        productCount: 0,
        sourceNames: [],
        seo: {
          title: `${name} - Aceray Designer`,
          description: `Explore Aceray commercial furniture products designed by ${name}.`,
        },
      })
    }

    const doc = bySlug.get(slug)
    doc.productCount += 1
    doc.sourceNames = unique([...doc.sourceNames, product.designer])
  }

  return [...bySlug.values()].sort((left, right) => left.name.localeCompare(right.name))
}

function createFamilyDocs(products) {
  const bySlug = new Map()

  for (const product of products) {
    const title = getFamily(product)
    const slug = slugify(title)
    if (!title || !slug) continue

    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        _id: `family-${slug}`,
        _type: 'family',
        title,
        slug: {_type: 'slug', current: slug},
        description: `Explore the Aceray ${title} collection across available product types and commercial applications.`,
        ...(FAMILY_HERO_IMAGES[slug] ? {heroImageUrl: FAMILY_HERO_IMAGES[slug]} : {}),
        productCount: 0,
        productTypes: [],
        sourceValues: [],
        seo: {
          title: `${title} Collection - Aceray`,
          description: `Browse Aceray ${title} collection products for hospitality and contract environments.`,
        },
      })
    }

    const doc = bySlug.get(slug)
    doc.productCount += 1
    doc.productTypes = unique([...doc.productTypes, getProductType(product)])
    doc.sourceValues = unique([...doc.sourceValues, ...(product.categories || []).filter((category) => cleanText(category) === title)])
  }

  for (const [slug, heroImageUrl] of Object.entries(FAMILY_HERO_IMAGES)) {
    if (!bySlug.has(slug)) {
      const title = slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
      bySlug.set(slug, {
        _id: `family-${slug}`,
        _type: 'family',
        title,
        slug: {_type: 'slug', current: slug},
        description: `Explore the Aceray ${title} collection across available product types and commercial applications.`,
        heroImageUrl,
        productCount: 0,
        productTypes: [],
        sourceValues: [],
        seo: {
          title: `${title} Collection - Aceray`,
          description: `Browse Aceray ${title} collection products for hospitality and contract environments.`,
        },
      })
    }
  }

  return [...bySlug.values()].sort((left, right) => left.title.localeCompare(right.title))
}

function createProductCategoryDocs(products) {
  return PRODUCT_TYPES.map((title, index) => {
    const sourceValues = new Set()
    const productCount = products.filter((product) => {
      const type = getProductType(product)
      if (type === title) {
        for (const value of [...(product.categories || []), ...(product.tags || [])]) {
          sourceValues.add(value)
        }
      }
      return type === title
    }).length

    return {
      _id: `product-category-${getProductTypeSlug(title)}`,
      _type: 'productCategory',
      title,
      slug: {_type: 'slug', current: getProductTypeSlug(title)},
      order: index + 1,
      isPrimaryNavigation: true,
      productCount,
      sourceValues: unique([...sourceValues]),
    }
  })
}

function createReport(sourceProducts, normalizedProducts, designerDocs, familyDocs, productCategoryDocs) {
  const productSlugs = new Set()
  const duplicateSlugs = []
  const missing = {
    slug: 0,
    designer: 0,
    family: 0,
    productType: 0,
    image: 0,
    description: 0,
  }
  const productTypes = new Map()
  const families = new Map()
  const designers = new Map()
  const features = new Map()
  const materials = new Map()

  for (const product of normalizedProducts) {
    const slug = readProductSlug(product)
    if (!slug) missing.slug += 1
    if (slug && productSlugs.has(slug)) duplicateSlugs.push(slug)
    if (slug) productSlugs.add(slug)
    if (!product.designer) missing.designer += 1
    if (!product.family) missing.family += 1
    if (!product.productType) missing.productType += 1
    if (!product.imageUrl && !product.mainImage) missing.image += 1
    if (!product.description) missing.description += 1

    increment(productTypes, product.productType)
    increment(families, product.family)
    increment(designers, product.designer)
    for (const feature of product.features || []) increment(features, feature)
    for (const material of product.materials || []) increment(materials, material)
  }

  const unresolved = {
    designerRefs: normalizedProducts.filter((product) => product.designerRef && !designerDocs.some((doc) => doc._id === product.designerRef._ref)).length,
    familyRefs: normalizedProducts.filter((product) => product.familyRef && !familyDocs.some((doc) => doc._id === product.familyRef._ref)).length,
    productTypeRefs: normalizedProducts.filter((product) => product.productTypeRef && !productCategoryDocs.some((doc) => doc._id === product.productTypeRef._ref)).length,
  }

  return {
    generatedAt: new Date().toISOString(),
    source: path.relative(rootDir, inputPath),
    counts: {
      sourceProducts: sourceProducts.length,
      normalizedProducts: normalizedProducts.length,
      designers: designerDocs.length,
      families: familyDocs.length,
      productCategories: productCategoryDocs.length,
      duplicateSlugs: duplicateSlugs.length,
    },
    missing,
    unresolved,
    duplicateSlugs,
    topProductTypes: [...productTypes.entries()].sort((a, b) => b[1] - a[1]),
    topFamilies: [...families.entries()].sort((a, b) => b[1] - a[1]).slice(0, 80),
    designers: [...designers.entries()].sort((a, b) => b[1] - a[1]),
    features: [...features.entries()].sort((a, b) => b[1] - a[1]),
    materials: [...materials.entries()].sort((a, b) => b[1] - a[1]),
  }
}

fs.mkdirSync(transformedDir, {recursive: true})
fs.mkdirSync(reportsDir, {recursive: true})

const sourceProducts = readNdjson(inputPath)
const normalizedProducts = sourceProducts.map(normalizeProduct)
const designerDocs = createDesignerDocs(normalizedProducts)
const familyDocs = createFamilyDocs(normalizedProducts)
const productCategoryDocs = createProductCategoryDocs(normalizedProducts)
const importDocs = [...designerDocs, ...familyDocs, ...productCategoryDocs, ...normalizedProducts]
const report = createReport(sourceProducts, normalizedProducts, designerDocs, familyDocs, productCategoryDocs)

writeNdjson(path.join(transformedDir, 'products-normalized.ndjson'), normalizedProducts)
writeNdjson(path.join(transformedDir, 'designers.ndjson'), designerDocs)
writeNdjson(path.join(transformedDir, 'families.ndjson'), familyDocs)
writeNdjson(path.join(transformedDir, 'product-categories.ndjson'), productCategoryDocs)
writeNdjson(path.join(transformedDir, 'sanity-import-normalized.ndjson'), importDocs)
fs.writeFileSync(
  path.join(reportsDir, 'taxonomy-readiness-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
)

console.log(`Normalized ${normalizedProducts.length} products`)
console.log(`Wrote ${designerDocs.length} designers, ${familyDocs.length} collections, ${productCategoryDocs.length} product categories`)
console.log(`Missing family: ${report.missing.family}; missing product type: ${report.missing.productType}; duplicate slugs: ${report.counts.duplicateSlugs}`)
