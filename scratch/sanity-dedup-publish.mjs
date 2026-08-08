/**
 * Sanity Dedup + Publish via MCP-compatible token
 * Removes the first (old) productPdfs entry from each product that has 2+ PDFs.
 * Uses the SANITY_API_WRITE_TOKEN from .env.
 * 
 * Run: node scratch/sanity-dedup-publish.mjs
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
config()

// Try MCP token first (write access), fall back to env
const TOKEN = process.env.SANITY_MCP_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN

if (!TOKEN) {
  console.error('No Sanity write token found. Set SANITY_MCP_TOKEN, SANITY_API_TOKEN, or SANITY_WRITE_TOKEN in .env')
  process.exit(1)
}

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

async function run() {
  console.log('Fetching all products with duplicate PDFs...')

  // Paginate through all 88
  let allDups = []
  let offset = 0
  const pageSize = 500
  while (true) {
    const batch = await client.fetch(
      `*[_type == "product" && count(productPdfs) > 1] | order(_id asc) [${offset}...${offset + pageSize}] { 
        _id, title,
        "oldKey": productPdfs[0]._key
      }`
    )
    allDups = allDups.concat(batch)
    if (batch.length < pageSize) break
    offset += pageSize
  }

  console.log(`Found ${allDups.length} products with duplicate PDFs to clean.\n`)

  let fixed = 0
  let failed = 0

  for (const doc of allDups) {
    if (!doc.oldKey) { failed++; continue }
    try {
      // Remove old duplicate, then publish immediately
      await client.patch(doc._id).unset([`productPdfs[_key=="${doc.oldKey}"]`]).commit({ visibility: 'async' })
      console.log(`  ✓ Removed old PDF from ${doc._id}`)
      fixed++
    } catch (err) {
      console.error(`  ✗ Failed ${doc._id}: ${err.message}`)
      failed++
    }
  }

  console.log(`\n=== DEDUP COMPLETE ===`)
  console.log(`Fixed: ${fixed}`)
  console.log(`Failed: ${failed}`)

  // Now publish all the drafts that were created
  console.log('\nPublishing all deduped drafts...')
  const draftIds = allDups.map(d => `drafts.${d._id}`)
  
  // Check which drafts exist
  const existingDrafts = await client.fetch(
    `*[_id in $ids]._id`,
    { ids: draftIds }
  )

  console.log(`Publishing ${existingDrafts.length} drafts...`)
  
  // Publish in batches of 25
  const BATCH = 25
  let published = 0
  for (let i = 0; i < existingDrafts.length; i += BATCH) {
    const batch = existingDrafts.slice(i, i + BATCH)
    const publishIds = batch.map(id => id.replace('drafts.', ''))
    try {
      // publishDocuments uses commit with explicit publish
      for (const id of publishIds) {
        try {
          await client.publish(id)
          published++
        } catch {
          // Some may not need publishing
        }
      }
    } catch (err) {
      console.error(`Batch publish error: ${err.message}`)
    }
  }
  
  console.log(`Published ${published} documents.`)
}

run().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
