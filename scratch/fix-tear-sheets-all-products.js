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

// 1. Collect all PDF attachments from XML export
const pdfAttachments = []
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'attachment') {
    const id = getText(item, 'wp:post_id')
    const url = getText(item, 'wp:attachment_url')
    const title = getText(item, 'title')
    if (id && url && /\.pdf(?:$|\?)/i.test(url)) {
      pdfAttachments.push({ id, url, title, filename: basename(url) })
    }
  }
})

console.log(`Indexed ${pdfAttachments.length} PDF attachments in WordPress XML.`)

// 2. Fetch all products from Sanity
const sanityProducts = await client.fetch(`*[_type == "product"] {
  _id, title, "slug": slug.current
}`)
console.log(`Loaded ${sanityProducts.length} Sanity products.`)

// Helper to score full-color tear sheets over bare CAD line drawings
function scorePdf(pdf, productTitle) {
  let score = 0
  const filename = pdf.filename.toLowerCase()
  const title = pdf.title.toLowerCase()
  const cleanProd = productTitle.toLowerCase().replace(/[^a-z0-9]/g, '')

  const cleanPdfFile = filename.replace(/[^a-z0-9]/g, '')
  if (cleanPdfFile.includes(cleanProd)) {
    score += 50
  }

  // Keywords that indicate full color spec sheet tear sheet (NOT bare CAD)
  const specKeywords = [
    'armchair', 'side-chair', 'chair', 'barstool', 'counter-stool', 'stool',
    'spec', 'tear-sheet', 'rocker', 'lounge', 'seating', 'sofa', 'table', 'bench', 'ottoman'
  ]
  specKeywords.forEach(kw => {
    if (filename.includes(kw) || title.includes(kw)) score += 100
  })

  // Prefer newer uploads (2026/2024 > 2023 > 2017)
  if (pdf.url.includes('/2026/')) score += 40
  else if (pdf.url.includes('/2024/')) score += 30
  else if (pdf.url.includes('/2023/')) score += 20

  // Penalize duplicate numbered suffixes like -1.pdf or bare CAD filenames if a descriptive one exists
  if (/-1\.pdf$/i.test(filename)) score -= 10

  return score
}

// 3. For each product, find the best full-color tear sheet PDF
const matches = []
sanityProducts.forEach(product => {
  const cleanProd = product.title.toUpperCase().replace(/[^A-Z0-9]/g, '')

  const candidates = pdfAttachments.filter(pdf => {
    const cleanFn = pdf.filename.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const cleanTitle = pdf.title.toUpperCase().replace(/[^A-Z0-9]/g, '')
    return cleanFn.includes(cleanProd) || cleanTitle.includes(cleanProd)
  })

  if (candidates.length > 0) {
    candidates.sort((a, b) => scorePdf(b, product.title) - scorePdf(a, product.title))
    const best = candidates[0]
    matches.push({ product, best })
  }
})

console.log(`Matched best full-color tear sheets for ${matches.length} Sanity products.`)

// Asset cache by URL to prevent duplicate uploads
const fileAssetCache = new Map()

async function uploadOrGetFileAsset(pdfUrl, filename) {
  if (fileAssetCache.has(pdfUrl)) {
    return fileAssetCache.get(pdfUrl)
  }

  try {
    console.log(`Downloading tear sheet PDF: ${pdfUrl}`)
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

async function runUpdate() {
  let updatedCount = 0
  let failedCount = 0

  for (const match of matches) {
    const { product, best } = match
    console.log(`\nUpdating ${product.title} (${product._id}) -> ${best.url}...`)

    const filename = `${product.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_spec.pdf`
    const asset = await uploadOrGetFileAsset(best.url, filename)

    if (asset) {
      const productPdfs = [{
        _key: `pdf_${best.id}_spec`,
        _type: 'object',
        title: `${product.title} Spec Sheet`,
        sourceUrl: asset.url,
        file: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          }
        }
      }]

      try {
        await client.patch(product._id).set({ productPdfs }).commit()
        updatedCount++
        console.log(`✓ Updated ${product.title} (${product._id}) -> ${asset.url}`)
      } catch (err) {
        failedCount++
        console.error(`✗ Failed to update ${product._id}: ${err.message}`)
      }
    }
  }

  console.log(`\n========================================`)
  console.log(`FULL COLOR TEAR SHEET UPDATE COMPLETE`)
  console.log(`Updated products: ${updatedCount}`)
  console.log(`Failed updates: ${failedCount}`)
  console.log(`========================================`)
}

runUpdate().catch(console.error)
