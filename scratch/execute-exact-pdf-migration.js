import { createClient } from '@sanity/client'
import { DOMParser } from '@xmldom/xmldom'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const token = 'skQMw1kGUxFSR48jrhIR4PjQf67yxwuUSFSp2DLfAsPT0NWCFvjikQvO0VTMJAEG5Txk91wjODIDfb953'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const xmlPath = "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml"
console.log(`Reading WordPress XML export: ${xmlPath}`)
const xml = readFileSync(xmlPath, 'utf8')
const doc = new DOMParser().parseFromString(xml, 'text/xml')
const items = Array.from(doc.getElementsByTagName('item'))

function getText(item, tag) {
  const el = item.getElementsByTagName(tag)[0]
  return el ? el.textContent.trim() : ''
}

// 1. Build attachment ID -> URL map
const attachmentMap = new Map()
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'attachment') {
    const id = getText(item, 'wp:post_id')
    const url = getText(item, 'wp:attachment_url')
    const title = getText(item, 'title')
    if (id && url && /\.pdf(?:$|\?)/i.test(url)) {
      attachmentMap.set(id, { id, url, title })
    }
  }
})

console.log(`Indexed ${attachmentMap.size} PDF attachment IDs from WordPress XML.`)

// 2. Fetch all products in Sanity to build Slug/Title -> Sanity _id map
console.log('Fetching all product documents from Sanity...')
const sanityProducts = await client.fetch(`*[_type == "product"] {
  _id, title, "slug": slug.current
}`)

const sanityMapBySlug = new Map()
const sanityMapByTitle = new Map()
const sanityMapById = new Map()

sanityProducts.forEach(p => {
  sanityMapById.set(p._id, p)
  if (p.slug) sanityMapBySlug.set(p.slug.toLowerCase(), p)
  if (p.title) sanityMapByTitle.set(p.title.toUpperCase(), p)
})

console.log(`Loaded ${sanityProducts.length} Sanity product documents.`)

// 3. Build product ID -> exact PDF URLs map from postmeta
const productPdfMap = new Map()
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'product') {
    const wpId = getText(item, 'wp:post_id')
    const title = getText(item, 'title')
    const postName = getText(item, 'wp:post_name')

    const pdfAttachmentIds = []
    const postmetas = Array.from(item.getElementsByTagName('wp:postmeta'))
    postmetas.forEach(pm => {
      const key = getText(pm, 'wp:meta_key')
      const val = getText(pm, 'wp:meta_value')
      if ((key === 'pdf' || key.startsWith('file-')) && val && val !== '0' && /^\d+$/.test(val)) {
        if (!pdfAttachmentIds.includes(val)) {
          pdfAttachmentIds.push(val)
        }
      }
    })

    if (pdfAttachmentIds.length > 0) {
      const resolvedPdfs = pdfAttachmentIds
        .map(attId => attachmentMap.get(attId))
        .filter(Boolean)
      
      if (resolvedPdfs.length > 0) {
        // Find matching Sanity doc
        const targetDoc = sanityMapById.get(`wp-product-${wpId}`) ||
                          sanityMapBySlug.get(postName.toLowerCase()) ||
                          sanityMapByTitle.get(title.toUpperCase())

        if (targetDoc) {
          productPdfMap.set(targetDoc._id, {
            wpId,
            sanityId: targetDoc._id,
            title,
            slug: postName,
            pdfs: resolvedPdfs
          })
        }
      }
    }
  }
})

console.log(`Matched exact postmeta PDF mappings for ${productPdfMap.size} Sanity products.`)

// 4. Cache of uploaded Sanity file assets by URL
const fileAssetCache = new Map()

async function uploadOrGetFileAsset(pdfUrl, filename) {
  if (fileAssetCache.has(pdfUrl)) {
    return fileAssetCache.get(pdfUrl)
  }

  try {
    console.log(`Downloading PDF: ${pdfUrl}`)
    const res = await fetch(pdfUrl)
    if (!res.ok) {
      console.warn(`Failed to fetch ${pdfUrl} (status ${res.status})`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())

    console.log(`Uploading asset to Sanity: ${filename}`)
    const asset = await client.assets.upload('file', buffer, {
      filename: filename || basename(pdfUrl)
    })

    fileAssetCache.set(pdfUrl, asset)
    return asset
  } catch (err) {
    console.error(`Error uploading PDF ${pdfUrl}: ${err.message}`)
    return null
  }
}

async function runMigration() {
  let updatedProducts = 0
  let failedProducts = 0

  for (const [sanityId, data] of productPdfMap.entries()) {
    console.log(`\nProcessing ${data.title} (${sanityId}) with ${data.pdfs.length} exact PDFs...`)
    const productPdfs = []

    for (let i = 0; i < data.pdfs.length; i++) {
      const pdf = data.pdfs[i]
      const filename = `${data.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_spec.pdf`
      const asset = await uploadOrGetFileAsset(pdf.url, filename)

      if (asset) {
        productPdfs.push({
          _key: `pdf_${pdf.id}_${i}`,
          _type: 'object',
          title: `${data.title} Spec Sheet`,
          sourceUrl: asset.url,
          file: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            }
          }
        })
      }
    }

    if (productPdfs.length > 0) {
      try {
        await client.patch(sanityId).set({ productPdfs }).commit()
        updatedProducts++
        console.log(`✓ Updated ${data.title} (${sanityId}) with ${productPdfs.length} exact PDF assets.`)
      } catch (err) {
        failedProducts++
        console.error(`✗ Failed to update ${sanityId}: ${err.message}`)
      }
    }
  }

  console.log(`\n========================================`)
  console.log(`EXACT PDF MIGRATION COMPLETE`)
  console.log(`Updated products: ${updatedProducts}`)
  console.log(`Failed products: ${failedProducts}`)
  console.log(`========================================`)
}

runMigration().catch(console.error)
