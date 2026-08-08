// Centralized constants for the Aceray project
export const CATEGORIES = [
  'Side Chairs',
  'Armchairs',
  'Lounge Seating',
  'Barstools',
  'Counter Stools',
  'Low Stools / Ottomans',
  'Benches',
  'Tables & Bases',
  'Outdoors'
];

export const CATEGORY_SLUGS = {
  'Low Stools / Ottomans': 'low-stools-ottomans',
  'Tables & Bases': 'tables-bases',
  Outdoors: 'outdoors',
}

export function getCategorySlug(category) {
  return CATEGORY_SLUGS[category] || category.toLowerCase().replace(/\s+/g, '-')
}
