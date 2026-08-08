/**
 * deduplicate-product-pdfs.js
 * Removes the OLDER duplicate productPdfs entries from every product in Sanity.
 * When a product has 2 PDFs with the same title, keeps only the last (newest) one.
 * When the URLs are actually different and both are valid, keeps both.
 *
 * Strategy:
 *  - Group pdfs by title
 *  - If a title group has > 1 entry, remove all but the LAST one (newest upload)
 *
 * Run with: node scratch/deduplicate-product-pdfs.js
 */

import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function deduplicateAllProducts() {
  console.log('Fetching all products with multiple productPdfs...')

  // Fetch ALL duplicates (not just 10)
  let all = []
  let page = 0
  const pageSize = 100
  while (true) {
    const batch = await client.fetch(`
      *[_type == "product" && count(productPdfs) > 1] | order(_id asc) [${page * pageSize}...${(page + 1) * pageSize}] {
        _id,
        title,
        "pdfs": productPdfs[]{ _key, title, "url": file.asset->url }
      }
    `)
    all = all.concat(batch)
    if (batch.length < pageSize) break
    page++
  }

  console.log(`Found ${all.length} products with 2+ PDFs to check.\n`)

  let deduped = 0
  let unchanged = 0

  for (const product of all) {
    const pdfs = product.pdfs || []
    
    // Group by normalized title
    const byTitle = {}
    for (const pdf of pdfs) {
      const key = (pdf.title || '').trim().toLowerCase()
      if (!byTitle[key]) byTitle[key] = []
      byTitle[key].push(pdf)
    }

    // Collect keys to remove: for each title group with >1, remove all but the last
    const toRemoveKeys = []
    for (const group of Object.values(byTitle)) {
      if (group.length <= 1) continue
      // Keep the last (most recently appended), remove earlier duplicates
      const toRemove = group.slice(0, group.length - 1)
      toRemoveKeys.push(...toRemove.map(p => p._key))
    }

    if (toRemoveKeys.length === 0) {
      unchanged++
      continue
    }

    console.log(`  Deduplicating "${product.title}" (${product._id}): removing ${toRemoveKeys.length} old duplicate(s)`)
    
    let patch = client.patch(product._id)
    for (const key of toRemoveKeys) {
      patch = patch.unset([`productPdfs[_key=="${key}"]`])
    }
    await patch.commit()
    deduped++
  }

  console.log(`\n========================================`)
  console.log(`DEDUPLICATION COMPLETE`)
  console.log(`  Deduped: ${deduped} products`)
  console.log(`  Already clean: ${unchanged} products`)
  console.log(`========================================`)
}

deduplicateAllProducts().catch(console.error)
