import { ACERAY_2026_PRICES } from '@/data/productPrices2026'

/**
 * Format a number as standard USD currency ($X or $X,XXX).
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return null
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Look up pricing details for a given product by its SKU, slug, or title.
 */
export function getProductPricing(product) {
  if (!product) return null

  // Collect candidate lookup keys
  const rawKeys = [
    product.sku,
    product.slug?.current || product.slug,
    product.title,
    product.name,
  ].filter(Boolean)

  for (const rawKey of rawKeys) {
    const key = String(rawKey).toLowerCase().trim()

    // 1. Direct match
    if (ACERAY_2026_PRICES[key]) {
      return normalizePricingData(ACERAY_2026_PRICES[key])
    }

    // 2. Standardized key (replace spaces/underscores with hyphens)
    const normalizedKey = key.replace(/[\s_]+/g, '-')
    if (ACERAY_2026_PRICES[normalizedKey]) {
      return normalizePricingData(ACERAY_2026_PRICES[normalizedKey])
    }

    // 3. Prefix/Family match (e.g., 'alba-1' for 'alba-1w')
    const familyKey = normalizedKey.split('-')[0]
    if (ACERAY_2026_PRICES[familyKey]) {
      return normalizePricingData(ACERAY_2026_PRICES[familyKey])
    }
  }

  return null
}

function normalizePricingData(raw) {
  if (!raw) return null

  const com = raw.com || null
  const startingPrice = raw.startingPrice || raw.woodSeat || raw.solidSurface || com || (raw.grades ? Math.min(...Object.values(raw.grades)) : null)

  return {
    startingPrice,
    comPrice: com,
    colPrice: raw.col || null,
    woodSeatPrice: raw.woodSeat || null,
    solidSurfacePrice: raw.solidSurface || null,
    grades: raw.grades || null,
    leatherPrice: raw.leather || null,
    yds: raw.yds || null,
    frameAdd: raw.frameAdd || null,
  }
}

/**
 * Calculate the effective price for a selected grade/material tier.
 */
export function calculatePriceForGrade(pricing, gradeTier) {
  if (!pricing) return null

  if (gradeTier === 'WOOD' && pricing.woodSeatPrice) return pricing.woodSeatPrice
  if (gradeTier === 'COM' && pricing.comPrice) return pricing.comPrice
  if (gradeTier === 'COL' && pricing.colPrice) return pricing.colPrice
  if (gradeTier === 'LEATHER' && pricing.leatherPrice) return pricing.leatherPrice
  if (pricing.grades && pricing.grades[gradeTier]) return pricing.grades[gradeTier]

  return pricing.startingPrice || pricing.comPrice
}
