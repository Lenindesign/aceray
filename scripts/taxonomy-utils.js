import {CATEGORIES, getCategorySlug} from '../src/constants.js'
import {getDesignerProfile, getDesignerSlug, normalizeDesignerName} from '../src/data/designerProfiles.js'

export const PRODUCT_TYPES = CATEGORIES

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

const NON_FAMILY_CATEGORIES = new Set([
  ...PRODUCT_TYPES,
  '83\'s',
  '17\'s',
  '71\'s',
  'Aurea',
  'Backless Barstool',
  'Bar Height Table Base',
  'Benches RTS',
  'Bench',
  'Chair',
  'Chrome',
  'Chrome + Black',
  'Cool2Mix',
  'C2M',
  'Extrema Metal',
  'Family',
  'Indoor Powder',
  'Dining Height Table Base',
  'Dolly',
  'Logo',
  'Lounge Chair',
  'Lounge Seating RTS',
  'Low Armchair',
  'Low Stool',
  'Low Table Base',
  'Love Seat',
  'Materials',
  'Matte + Chrome',
  'Outdoor Powder Coat Steel',
  'Planet',
  'Products',
  'Ready to Ship',
  'Side Chairs RTS',
  'Skill',
  'Stacking Armchair',
  'Stacking Barstool',
  'Stacking Chair',
  'Stacking Counter Stool',
  'Sofa',
  'Swivel',
  'Swivel Armchair',
  'Swivel Barstool',
  'Swivel Counter Stool',
  'Swivel Stool',
  'Table Base',
  'Table Bases',
  'Table Tops',
  'Tables',
  'Tables RTS',
  'Tables & Bases',
  'Tables &amp; Bases',
  'Uncategorized',
  'Upholstery',
  'What\'s New',
  'Wood',
])

const PRODUCT_TYPE_ALIASES = new Map([
  ['armchairs', 'Armchairs'],
  ['armchairsrts', 'Armchairs'],
  ['barstools', 'Barstools'],
  ['barstoolsrts', 'Barstools'],
  ['bench', 'Benches'],
  ['benches', 'Benches'],
  ['benchesrts', 'Benches'],
  ['counterstools', 'Counter Stools'],
  ['counterstoolsrts', 'Counter Stools'],
  ['loungeseating', 'Lounge Seating'],
  ['loungeseatingrts', 'Lounge Seating'],
  ['loungechair', 'Lounge Seating'],
  ['loveseat', 'Lounge Seating'],
  ['sofa', 'Lounge Seating'],
  ['lowstoolsottomans', 'Low Stools / Ottomans'],
  ['outdoorseating', 'Outdoors'],
  ['outdoors', 'Outdoors'],
  ['sidechairs', 'Side Chairs'],
  ['sidechairsrts', 'Side Chairs'],
  ['tablebase', 'Tables & Bases'],
  ['tablebases', 'Tables & Bases'],
  ['tables', 'Tables & Bases'],
  ['tablesbases', 'Tables & Bases'],
  ['tablesrts', 'Tables & Bases'],
  ['tabletops', 'Tables & Bases'],
  ['barheighttablebase', 'Tables & Bases'],
  ['diningheighttablebase', 'Tables & Bases'],
  ['lowtablebase', 'Tables & Bases'],
])

const MATERIAL_LABELS = [
  'Wood',
  'Upholstery',
  'Chrome',
  'Chrome + Black',
  'Matte + Chrome',
  'Outdoor Powder Coat Steel',
]

const INVALID_FAMILY_KEYS = new Set(['copy', 'cool', 'dolly', 'untitled'])

export function decodeEntities(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&nbsp;/g, ' ')
}

export function cleanText(value = '') {
  return decodeEntities(value).replace(/\s+/g, ' ').trim()
}

export function comparable(value = '') {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function slugify(value = '') {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function unique(values = []) {
  return [...new Set(values.filter(Boolean).map(cleanText).filter(Boolean))]
}

export function readProductSlug(product) {
  return typeof product?.slug === 'string' ? product.slug : product?.slug?.current || ''
}

export function getProductType(product = {}) {
  const values = [...(product.categories || []), ...(product.tags || [])]
  for (const value of values) {
    const mapped = PRODUCT_TYPE_ALIASES.get(comparable(value))
    if (mapped) return mapped
  }

  const haystack = `${product.title || ''} ${product.description || ''}`
  if (/\b(outdoor|patio)\b/i.test(haystack)) return 'Outdoors'
  if (/\b(barstool|bar stool)\b/i.test(haystack)) return 'Barstools'
  if (/\b(counter stool)\b/i.test(haystack)) return 'Counter Stools'
  if (/\b(armchair|arm chair)\b/i.test(haystack)) return 'Armchairs'
  if (/\b(lounge|sofa|love seat|loveseat)\b/i.test(haystack)) return 'Lounge Seating'
  if (/\b(bench)\b/i.test(haystack)) return 'Benches'
  if (/\b(table|base)\b/i.test(haystack)) return 'Tables & Bases'
  if (/\b(side chair|chair)\b/i.test(haystack)) return 'Side Chairs'

  return ''
}

export function getMaterials(product = {}) {
  const values = [...(product.categories || []), ...(product.tags || [])]
  const materials = MATERIAL_LABELS.filter((label) => values.some((value) => comparable(value) === comparable(label)))
  return unique(materials)
}

export function getFeatures(product = {}) {
  const values = [...(product.categories || []), ...(product.tags || [])]
  const allText = cleanText(`${values.join(' ')} ${product.title || ''} ${product.description || ''}`)
  const features = []

  if (/\b(ready to ship|quick ship|rts)\b/i.test(allText)) features.push('Ready to Ship')
  if (product.stacking && !/^no$/i.test(cleanText(product.stacking))) features.push('Stacking')
  if (/\bstacking\b/i.test(allText)) features.push('Stacking')
  if (/\bswivel\b/i.test(allText)) features.push('Swivel')
  if (/\b(outdoor|patio|powder coat)\b/i.test(allText)) features.push('Outdoor')
  if (/\brocker|rocking\b/i.test(allText)) features.push('Rocker')
  if (/\bsled\b/i.test(allText)) features.push('Sled')
  if (/\bcaster|casters\b/i.test(allText)) features.push('Caster')
  if (/\bdolly\b/i.test(allText)) features.push('Dolly')
  if (/\bganging\b/i.test(allText)) features.push('Ganging')

  return unique(features)
}

export function getTitlePrefix(product = {}) {
  const title = cleanText(product.title || '').replace(/^#/, '')
  const first = title.split('-')[0].match(/^[a-z]+/i)?.[0] || ''
  if (!/^[a-z][a-z0-9]*$/i.test(first)) return ''
  if (INVALID_FAMILY_KEYS.has(comparable(first))) return ''
  return first.length >= 3 ? first : ''
}

export function getFamily(product = {}) {
  const categories = product.categories || []
  const titlePrefix = getTitlePrefix(product)
  const titleMatch = categories.find((category) => comparable(category) === comparable(titlePrefix))
  if (titleMatch) return cleanText(titleMatch)

  const firstFamilyCategory = categories.find((category) => {
    const clean = cleanText(category)
    const key = comparable(clean)
    return clean &&
      !INVALID_FAMILY_KEYS.has(key) &&
      !NON_FAMILY_CATEGORIES.has(clean) &&
      !/^\(?\d/.test(clean) &&
      !/^\(/.test(clean) &&
      !/^t\d/i.test(clean) &&
      !/\b(RTS|chair|stool|barstool|table|base|bench|sofa|dolly|seat)\b/i.test(clean) &&
      !/^Stacking\b/i.test(clean)
  })
  if (firstFamilyCategory) return cleanText(firstFamilyCategory)

  return titlePrefix ? titlePrefix.charAt(0).toUpperCase() + titlePrefix.slice(1).toLowerCase() : ''
}

export function normalizeDesigner(value = '') {
  return normalizeDesignerName(cleanText(value))
}

export function getDesignerDocSlug(value = '') {
  return getDesignerSlug(value)
}

export function getDesignerProfileData(value = '') {
  return getDesignerProfile(value)
}

export function getProductTypeSlug(value = '') {
  return getCategorySlug(value)
}
