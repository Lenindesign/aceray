import { getCliClient } from 'sanity/cli'
import { ACERAY_2026_PRICES } from '../src/data/productPrices2026.js'

const client = getCliClient({ apiVersion: '2023-08-01' })

function normalizeKey(rawKey) {
  if (!rawKey) return ''
  return String(rawKey).toLowerCase().trim().replace(/[\s_]+/g, '-')
}

function getPricingForProduct(doc) {
  const keys = [
    doc.sku,
    doc.slug?.current || doc.slug,
    doc.title,
  ].filter(Boolean)

  for (const rawKey of keys) {
    const key = normalizeKey(rawKey)

    if (ACERAY_2026_PRICES[key]) {
      return ACERAY_2026_PRICES[key]
    }

    const familyKey = key.split('-')[0]
    if (ACERAY_2026_PRICES[familyKey]) {
      return ACERAY_2026_PRICES[familyKey]
    }
  }

  return null
}

async function syncPrices() {
  console.log('Fetching products from Sanity CMS...')
  const products = await client.fetch(`*[_type == "product"]{_id, title, slug, sku}`)
  console.log(`Found ${products.length} total products in Sanity.`)

  let matchedCount = 0
  let transaction = client.transaction()

  for (const doc of products) {
    const pricing = getPricingForProduct(doc)
    if (!pricing) continue

    matchedCount++
    const startingPrice = pricing.startingPrice || pricing.woodSeat || pricing.solidSurface || pricing.com || (pricing.grades ? Math.min(...Object.values(pricing.grades)) : null)

    const patchData = {
      startingPrice: startingPrice || null,
      comPrice: pricing.com || null,
      colPrice: pricing.col || null,
      woodSeatPrice: pricing.woodSeat || null,
      leatherPrice: pricing.leather || null,
      comYardage: pricing.yds || null,
    }

    // Remove null fields from patch
    Object.keys(patchData).forEach(k => patchData[k] === null && delete patchData[k])

    transaction.patch(doc._id, p => p.set(patchData))

    if (matchedCount % 50 === 0) {
      console.log(`Committing batch up to ${matchedCount}...`)
      await transaction.commit()
      transaction = client.transaction()
    }
  }

  if (matchedCount % 50 !== 0) {
    console.log(`Committing final batch up to ${matchedCount}...`)
    await transaction.commit()
  }

  console.log(`✅ Successfully updated ${matchedCount} out of ${products.length} products with 2026 pricing in Sanity!`)
}

syncPrices().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
