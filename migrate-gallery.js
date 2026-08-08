import { createClient } from '@sanity/client'
import fetch from 'node-fetch'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // set this in your environment
  useCdn: false,
})

async function uploadImageFromUrl(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch image: ${url} (${response.status})`)

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const filename = url.split('/').pop().split('?')[0]

  const asset = await client.assets.upload('image', response.body, {
    filename,
    contentType,
  })

  return asset._id
}

async function migrateProduct(product) {
  const { _id, title, galleryUrls, gallery = [] } = product

  // Collect already-uploaded asset refs to avoid duplicates
  const existingRefs = new Set(gallery.map((img) => img.asset?._ref).filter(Boolean))

  const newImages = []

  for (const url of galleryUrls) {
    try {
      console.log(`  Uploading: ${url}`)
      const assetId = await uploadImageFromUrl(url)

      if (existingRefs.has(assetId)) {
        console.log(`  Already exists, skipping.`)
        continue
      }

      newImages.push({
        _type: 'image',
        _key: assetId.replace('image-', '').slice(0, 12),
        asset: { _type: 'reference', _ref: assetId },
      })

      existingRefs.add(assetId)
    } catch (err) {
      console.error(`  ERROR uploading ${url}:`, err.message)
    }
  }

  if (newImages.length === 0) {
    console.log(`  No new images to add for "${title}".`)
    return
  }

  await client
    .patch(_id)
    .setIfMissing({ gallery: [] })
    .append('gallery', newImages)
    .commit()

  console.log(`  ✓ Patched "${title}" with ${newImages.length} new image(s).`)
}

async function run() {
  // Fetch all products that have galleryUrls populated
  const products = await client.fetch(`
    *[_type == "product" && defined(galleryUrls) && count(galleryUrls) > 0]{
      _id, title, galleryUrls, gallery
    }
  `)

  console.log(`Found ${products.length} product(s) with galleryUrls.\n`)

  for (const product of products) {
    console.log(`Processing: ${product.title} (${product._id})`)
    await migrateProduct(product)
    console.log('')
  }

  console.log('Migration complete.')
}

run().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})