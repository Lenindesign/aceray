const SITE_URL = 'https://aceray.com'
const DEFAULT_TITLE = 'Aceray - The Look of Seating | Premium Commercial Furniture'
const DEFAULT_DESCRIPTION = 'Aceray presents design professionals with contemporary commercial seating, lounge furniture, tables, finishes, and installation resources.'
const DEFAULT_IMAGE = `${SITE_URL}/aceray_hero_lifestyle.webp`

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  element.href = href
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  const base =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'aceray.com' &&
    window.location.hostname !== 'www.aceray.com'
      ? window.location.origin
      : SITE_URL
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const ACERAY_ORGANIZATION_SCHEMA = {
  '@type': ['Organization', 'FurnitureStore', 'LocalBusiness'],
  '@id': 'https://aceray.com/#organization',
  name: 'Aceray',
  legalName: 'Aceray LLC',
  url: 'https://aceray.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://aceray.com/assets/logo.svg',
  },
  description:
    'Manufacturer of high-performance commercial seating, contract dining chairs, barstools, lounge furniture, and custom table bases for hospitality, corporate, and commercial interiors.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4465 Kipling St., Suite 202',
    addressLocality: 'Wheat Ridge',
    addressRegion: 'CO',
    postalCode: '80033',
    addressCountry: 'US',
  },
  telephone: '+1-303-733-3404',
  email: 'info@aceray.com',
  priceRange: '$$ - $$$',
  knowsAbout: [
    'Commercial Seating',
    'Contract Furniture',
    'BIFMA Standards',
    'Hospitality Dining Chairs',
    'Molded Polyurethane Foam',
    'Wyzenbeek Abrasion Standards',
    'COM Fabrics',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+1-303-733-3404',
    email: 'info@aceray.com',
    url: 'https://aceray.com/contact',
  },
}

export const ACERAY_WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': 'https://aceray.com/#website',
  name: 'Aceray',
  url: 'https://aceray.com',
  publisher: {
    '@id': 'https://aceray.com/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://aceray.com/catalog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export function createBreadcrumbJsonLd(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function setSeoMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index, follow',
  jsonLd,
  jsonLdId = 'page-jsonld',
} = {}) {
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  document.title = title
  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertLink('canonical', url)

  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Aceray' })

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })

  if (jsonLd) {
    let script = document.getElementById(jsonLdId)
    if (!script) {
      script = document.createElement('script')
      script.id = jsonLdId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  }
}

export function removeSeoJsonLd(id) {
  document.getElementById(id)?.remove()
}

