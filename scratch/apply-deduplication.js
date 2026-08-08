import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const token = 'skQMw1kGUxFSR48jrhIR4PjQf67yxwuUSFSp2DLfAsPT0NWCFvjikQvO0VTMJAEG5Txk91wjODIDfb953'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2023-08-01',
  token,
  useCdn: false
})

async function run() {
  const patches = JSON.parse(readFileSync(resolve('scratch/pdf-deduplication-patches.json'), 'utf8'))
  const ids = Object.keys(patches)
  console.log(`Fetched token. backing up current states first...`)

  // Backup current state of these products to scratch/backup-raw-duplicates.json
  const currentStates = await client.fetch(`*[_id in $ids]{_id, title, productPdfs}`, { ids })
  writeFileSync(resolve('scratch/backup-raw-duplicates.json'), JSON.stringify(currentStates, null, 2))
  console.log(`Backup completed. Saved to scratch/backup-raw-duplicates.json`)

  console.log(`Applying deduplication patches for ${ids.length} products...`)

  let success = 0
  let failed = 0

  for (const id of ids) {
    const patchData = patches[id]
    const setOps = patchData.patches.find(p => p.set)?.set
    if (!setOps) continue

    try {
      console.log(`Patching ${id} with only correct PDF...`)
      await client.patch(id).set(setOps).commit()
      success++
    } catch (e) {
      failed++
      console.error(`Failed to patch ${id}:`, e.message)
    }
  }

  console.log(`\nDeduplication patches completed. Success: ${success}, Failed: ${failed}`)
}

run().catch(console.error)
