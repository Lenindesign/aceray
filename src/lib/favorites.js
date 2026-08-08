export const FAVORITES_STORAGE_KEY = 'aceray:favorites'
export const FAVORITES_CHANGED_EVENT = 'aceray:favorites-changed'

function readSlugs() {
  if (typeof window === 'undefined') return []

  try {
    const value = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function writeSlugs(slugs) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(new Set(slugs))))
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT))
}

export function getFavoriteSlugs() {
  return readSlugs()
}

export function isFavoriteProduct(slug) {
  return Boolean(slug && readSlugs().includes(slug))
}

export function toggleFavoriteProduct(slug) {
  if (!slug) return false

  const slugs = readSlugs()
  const isFavorite = slugs.includes(slug)
  const nextSlugs = isFavorite
    ? slugs.filter((item) => item !== slug)
    : [slug, ...slugs]

  writeSlugs(nextSlugs)
  return !isFavorite
}
