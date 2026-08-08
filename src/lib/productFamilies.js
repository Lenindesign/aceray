import { CATEGORIES } from '@/constants'

const NON_FAMILY_CATEGORIES = new Set([
  ...CATEGORIES,
  'Aurea',
  'Benches RTS',
  'Chrome',
  'Chrome + Black',
  'Extrema Metal',
  'Lounge Seating RTS',
  'Matte + Chrome',
  'Planet',
  'Ready to Ship',
  'Side Chairs RTS',
  'Skill',
  'Stacking 2-Seater',
  'Stacking Chair',
  'Tables RTS',
  'Uncategorized',
  'Upholstery',
  "What's New",
  'Wood',
])

export function normalizeCategory(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function getFamilySlug(value = '') {
  return value
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const FAMILY_HERO_IMAGES = {
  alba: '/assets/migrated/Alba-fam-A.webp',
  almea: '/assets/migrated/Epoca_Ambiente_almea_web-jpg.webp',
  ampio: '/assets/migrated/Ampio-family.webp',
  arte: '/assets/migrated/0006s_0000_Arte-UU-horizontal-C.webp',
  asta: '/assets/migrated/Asta-W-install.webp',
  ballo: '/assets/migrated/Aceray-Ballo-chairs-setting.jpg',
  bora: '/assets/migrated/bora-family.webp',
  ciao: '/assets/migrated/Aceray_Ciao-family-jpg.webp',
  corso: '/assets/migrated/corso3.webp',
  forte: '/assets/migrated/Aceray-Forte-armchair-install.jpg',
  gala: '/assets/migrated/Gala-swiv-install.webp',
  libro: '/assets/migrated/Libro-3-seats.webp',
  mira: '/assets/migrated/Mira-X3-horizontal.webp',
  nota: '/assets/migrated/NOTA_group.jpg',
  riva: '/assets/migrated/Aceray_Riva-family243-jpg.webp',
  solo: '/assets/migrated/Solo-S-horizontal.webp',
  spazio: '/assets/migrated/Spazio-R-2M-2.webp',
  tana: '/assets/migrated/aceray_TANA-3-family-jpg.webp',
}

function getProductFamilyHint(title = '') {
  return normalizeCategory(title.replace(/^#/, '').split('-')[0])
}

function getProductSlugHint(slug) {
  const value = typeof slug === 'string' ? slug : slug?.current || ''
  return normalizeCategory(value.split('-')[0])
}

export function productBelongsToFamily(product, familySlug = '') {
  if (!product || !familySlug) return false

  const normalizedFamily = normalizeCategory(familySlug)
  const categories = product.categories || []

  return categories.some((category) => normalizeCategory(category) === normalizedFamily) ||
    getProductFamilyHint(product.title) === normalizedFamily ||
    getProductSlugHint(product.slug) === normalizedFamily
}

export function getCollectionFamily(product) {
  const categories = product?.categories || []
  const familyHint = getProductFamilyHint(product?.title)
  const titleMatchedFamily = categories.find((cat) => normalizeCategory(cat) === familyHint)

  if (titleMatchedFamily) return titleMatchedFamily

  return categories.find((cat) => (
    cat &&
    !NON_FAMILY_CATEGORIES.has(cat) &&
    !/\bRTS\b/i.test(cat) &&
    !/^Stacking\b/i.test(cat)
  )) || ''
}

function scoreFamilyImage(url = '', familySlug = '') {
  const value = url.toLowerCase()
  let score = 0

  if (value.includes(familySlug)) score += 10
  if (/family|fam|group|lineup|horizontal|ambiente|install|setting/.test(value)) score += 8
  if (/front|profile|back|drawing|dimension/.test(value)) score -= 4

  return score
}

export function getPreferredFamilyHeroImage(products = [], familySlug = '') {
  if (FAMILY_HERO_IMAGES[familySlug]) return FAMILY_HERO_IMAGES[familySlug]

  const candidates = products
    .flatMap((product) => [product.imageUrl, ...(product.galleryUrls || [])])
    .filter(Boolean)
    .map((url) => ({ url, score: scoreFamilyImage(url, familySlug) }))
    .sort((left, right) => right.score - left.score)

  return candidates[0]?.url || ''
}
