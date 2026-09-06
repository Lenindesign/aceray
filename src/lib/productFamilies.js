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
  if (!value) return ''
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function getFamilySlug(value = '') {
  if (!value) return ''
  return String(value)
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

export const FAMILY_DESCRIPTIONS = {
  alba: 'The well-established injection-molded Alba style is now offered as bar and counter stools, extending its clean lines and ergonomic comfort to elevated seating. Offered in both armed and armless versions, the collection delivers comfort, flexibility, and enduring appeal to the needs of high-traffic hospitality spaces. Available in COM, COL or Aceray’s graded in upholstery, as well as in Aceray’s standard wood stains or in custom wood finishes.',
  almea: 'The armchair and tall back lounge chair additions to our current Almea series offer contemporary, yet minimalist design that can provide sophistication in dining and lounge applications. The distinctive design of Almea is available in Aceray standard wood stains or in a custom wood finish, as well as COM, COL or Aceray graded in upholstery.',
  arte: 'Modern looks are inspired by heritage designs. In addition to the current Arte-U seating collection with an upholstered seat and single-walled natural cane back, we are bringing in Arte-UU with welt detailed upholstered back. The back frames still serve as a practical handle for a broad range of applications. Available in COM, COL or Aceray’s graded in upholstery, as well as in Aceray’s standard wood stains or in a custom wood finish.',
  bora: 'With fluid curves and a gently contoured seat, the Bora High Back and Low Back injection molded foam lounge armchairs work well with both contemporary and more traditional décor across a multitude of hospitality and office environments. Available in COM, COL or Aceray’s graded in upholstery, in Aceray’s standard wood stains or in a custom wood finish. Stretchy fabric is suggested.',
  ciao: 'This tall back addition to the current Ciao line suits well within guest, hospitality and restaurant applications. The sleek Italian curved back comes with a welt detail, while the tapered solid beech wood legs give Ciao a tailored silhouette. Available in COM, COL or Aceray’s graded in upholstery, as well as in Aceray’s standard wood stains or in custom wood finishes.',
  riva: 'The Riva collection is inspired by the Japanese aesthetics of minimalism. Crafted in solid ash wood, we added the armless barstools and counter stools, as well as lounge armchairs and lounge rockers to the previous extremely popular Riva collection. The seat and back come either in saddle leather with beautifully stitched exposed seams, in hand woven rush or upholstered in COM, COL or Aceray graded in upholstery. Due to its handcrafted nature, each Riva item is slightly unique. Available in Aceray standard wood stains or in custom wood finishes.',
  solo: 'Handcrafted by Italian craftsmen with a generous body and a sturdy beech wood frame, Solo-V is a comfortable and stylish choice for both hospitality and office lounges. Upholstery is available in COM, COL or Aceray’s graded in upholstery, as well as in Aceray’s standard wood stains or in a custom wood finish. Stretchy fabric is suggested for the curved back.',
  'solo-v': 'Handcrafted by Italian craftsmen with a generous body and a sturdy beech wood frame, Solo-V is a comfortable and stylish choice for both hospitality and office lounges. Upholstery is available in COM, COL or Aceray’s graded in upholstery, as well as in Aceray’s standard wood stains or in a custom wood finish. Stretchy fabric is suggested for the curved back.',
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

export const CANONICAL_CATEGORIES = [
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

export function formatProductTitleWithCategory(str) {
  if (!str) return ''
  const regex = /^(.+?)\s+(side\s*chairs?|armchairs?|lounge\s*chairs?|lounge\s*seating|counter\s*stools?|barstools?|low\s*stools?|ottomans?|poufs?|stools?|tables?|benches?|outdoor\s*chairs?)$/i
  const match = str.trim().match(regex)
  if (match) {
    const model = match[1].toUpperCase()
    const catLower = match[2].toLowerCase()
    let catTitle = match[2]
    if (catLower.includes('low stool')) catTitle = 'Low Stool'
    else if (catLower.includes('ottoman')) catTitle = 'Ottoman'
    else if (catLower.includes('pouf')) catTitle = 'Ottoman'
    else if (catLower.includes('side chair')) catTitle = 'Side Chair'
    else if (catLower.includes('armchair')) catTitle = 'Armchair'
    else if (catLower.includes('lounge')) catTitle = 'Lounge Chair'
    else if (catLower.includes('counter stool')) catTitle = 'Counter Stool'
    else if (catLower.includes('barstool') || catLower.includes('stool')) catTitle = 'Barstool'
    else if (catLower.includes('bench')) catTitle = 'Bench'
    else if (catLower.includes('table')) catTitle = 'Table'
    else if (catLower.includes('outdoor')) catTitle = 'Outdoor Chair'
    return `${model} ${catTitle}`
  }
  return str.toUpperCase()
}

export function getCanonicalCategory(categories = []) {
  const catList = Array.isArray(categories) ? categories : []

  // 1. Filter out RTS tags, vinyl groups, and material tags
  const filtered = catList.filter((c) => {
    const s = (typeof c === 'string' ? c : c?.title || '').trim()
    if (/rts$/i.test(s) || /ready to ship/i.test(s)) return false
    if (/^(materials|wood|upholstery|swivel|chrome|indoor powder|extrema metal|matte \+ chrome|chrome \+ black)$/i.test(s)) return false
    if (/^(planet|skill|aurea)$/i.test(s)) return false
    if (/^(products|what's new)$/i.test(s)) return false
    return true
  })

  // 2. Exact match against CANONICAL_CATEGORIES
  const exact = CANONICAL_CATEGORIES.find((cat) =>
    filtered.some((c) => {
      const s = (typeof c === 'string' ? c : c?.title || '').toLowerCase()
      return s === cat.toLowerCase() || s === cat.toLowerCase().replace('&', '&amp;')
    })
  )
  if (exact) return exact

  // 3. Fallback to specific pattern matching on filtered categories (order matters!)
  const priorityPatterns = [
    { pattern: /low\s*stool|ottoman|pouf/i, name: 'Low Stools / Ottomans' },
    { pattern: /counter\s*stool/i, name: 'Counter Stools' },
    { pattern: /barstool/i, name: 'Barstools' },
    { pattern: /armchair/i, name: 'Armchairs' },
    { pattern: /side\s*chair/i, name: 'Side Chairs' },
    { pattern: /lounge/i, name: 'Lounge Seating' },
    { pattern: /bench/i, name: 'Benches' },
    { pattern: /table\s*base/i, name: 'Table Bases' },
    { pattern: /table\s*top/i, name: 'Table Tops' },
    { pattern: /table/i, name: 'Tables & Bases' },
    { pattern: /outdoor/i, name: 'Outdoors' },
  ]

  for (const { pattern, name } of priorityPatterns) {
    const found = filtered.find((c) => {
      const s = typeof c === 'string' ? c : c?.title || ''
      return pattern.test(s)
    })
    if (found) return name
  }

  return filtered[0] || catList[0] || ''
}

export function getCategorySuffix(title, categories) {
  if (!title) return ''
  const primaryCat = getCanonicalCategory(categories)
  if (!primaryCat) return ''

  const lowerCat = (typeof primaryCat === 'string' ? primaryCat : (primaryCat?.title || '')).toLowerCase()
  const lowerTitle = title.toLowerCase()

  let categorySuffix = typeof primaryCat === 'string' ? primaryCat : (primaryCat?.title || '')
  if (lowerCat.includes('low stool') || lowerCat.includes('ottoman') || lowerCat.includes('pouf')) {
    if (lowerTitle.includes('pouf') || lowerTitle.includes('ottoman') || lowerTitle.endsWith('-ot')) {
      categorySuffix = 'Ottoman'
    } else {
      categorySuffix = 'Low Stool'
    }
  } else if (lowerCat.includes('side chair')) {
    categorySuffix = 'Side Chair'
  } else if (lowerCat.includes('armchair')) {
    categorySuffix = 'Armchair'
  } else if (lowerCat.includes('lounge')) {
    categorySuffix = 'Lounge Chair'
  } else if (lowerCat.includes('counter stool')) {
    categorySuffix = 'Counter Stool'
  } else if (lowerCat.includes('barstool') || lowerCat.includes('stool')) {
    categorySuffix = 'Barstool'
  } else if (lowerCat.includes('bench')) {
    categorySuffix = 'Bench'
  } else if (lowerCat.includes('table base')) {
    categorySuffix = 'Table Base'
  } else if (lowerCat.includes('table top')) {
    categorySuffix = 'Table Top'
  } else if (lowerCat.includes('table')) {
    categorySuffix = 'Table'
  } else if (lowerCat.includes('outdoor')) {
    categorySuffix = 'Outdoor Chair'
  }

  if (/^\d+/i.test(categorySuffix) || /^c2m/i.test(categorySuffix)) return ''

  if (
    lowerTitle.includes('chair') ||
    lowerTitle.includes('armchair') ||
    lowerTitle.includes('stool') ||
    lowerTitle.includes('table') ||
    lowerTitle.includes('lounge') ||
    lowerTitle.includes('bench') ||
    lowerTitle.includes('sofa') ||
    lowerTitle.includes(categorySuffix.toLowerCase())
  ) {
    return ''
  }

  return categorySuffix
}

export function getEnrichedProductTitle(title, categories) {
  if (!title) return ''
  const suffix = getCategorySuffix(title, categories)
  if (!suffix) return formatProductTitleWithCategory(title)

  return `${title.toUpperCase()} ${suffix}`
}


