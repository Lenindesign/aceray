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

// 1. Build attachment map
const attachmentMap = new Map() // attId -> { id, url, title, parentId, ext }
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'attachment') {
    const id = getText(item, 'wp:post_id')
    const url = getText(item, 'wp:attachment_url')
    const title = getText(item, 'title')
    const parentId = getText(item, 'wp:post_parent')

    if (id && url) {
      const extMatch = url.match(/\.([a-zA-Z0-9]+)(?:$|\?)/)
      if (extMatch) {
        const ext = extMatch[1].toLowerCase()
        if (['dwg', 'dxf', 'zip', 'rar', '7z', 'rvt', 'step', 'stp', 'obj', 'skp', '3ds', 'fbx', 'iges', 'stl'].includes(ext)) {
          attachmentMap.set(id, { id, url, title, parentId, ext })
        }
      }
    }
  }
})

console.log(`Indexed ${attachmentMap.size} non-PDF file attachments from WordPress XML.`)

// 2. Fetch all products in Sanity
console.log('Fetching Sanity products...')
const sanityProducts = await client.fetch(`*[_type == "product"] {
  _id, title, "slug": slug.current, wpPostId
}`)

const sanityMapById = new Map()
const sanityMapBySlug = new Map()
const sanityMapByTitle = new Map()

sanityProducts.forEach(p => {
  sanityMapById.set(p._id, p)
  if (p.wpPostId) sanityMapById.set(`wp-product-${p.wpPostId}`, p)
  if (p.slug) sanityMapBySlug.set(p.slug.toLowerCase(), p)
  if (p.title) sanityMapByTitle.set(p.title.toUpperCase(), p)
})

console.log(`Loaded ${sanityProducts.length} Sanity products.`)

// 3. Map non-PDF attachments to Sanity products
const productFilesMap = new Map() // sanityId -> { product, drawings: [], files3d: [], zips: [] }

function getOrCreate(product) {
  if (!productFilesMap.has(product._id)) {
    productFilesMap.set(product._id, {
      product,
      drawings: [],
      files3d: [],
      zips: [],
      seenUrls: new Set()
    })
  }
  return productFilesMap.get(product._id)
}

// Map by parentId first
for (const att of attachmentMap.values()) {
  let targetDoc = sanityMapById.get(`wp-product-${att.parentId}`)

  if (!targetDoc) {
    // Try filename matching
    const filename = att.url.split('/').pop().replace(/\.[^/.]+$/, "").toUpperCase()
    for (const [pTitle, pObj] of sanityMapByTitle.entries()) {
      if (filename.startsWith(pTitle) || filename.includes(pTitle)) {
        targetDoc = pObj
        break
      }
    }
  }

  if (targetDoc) {
    const entry = getOrCreate(targetDoc)
    if (entry.seenUrls.has(att.url)) continue
    entry.seenUrls.add(att.url)

    if (['dwg', 'dxf'].includes(att.ext)) {
      entry.drawings.push(att)
    } else if (['zip', 'rar', '7z', 'rvt'].includes(att.ext)) {
      entry.zips.push(att)
    } else {
      entry.files3d.push(att)
    }
  }
}

console.log(`Matched non-PDF download files for ${productFilesMap.size} products.`)

// 4. Asset cache & uploader
const assetCache = new Map()

async function uploadOrGetAsset(fileUrl) {
  if (assetCache.has(fileUrl)) return assetCache.get(fileUrl)

  try {
    console.log(`  Downloading: ${fileUrl}`)
    const res = await fetch(fileUrl)
    if (!res.ok) {
      console.warn(`  Failed HTTP ${res.status} for ${fileUrl}`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const fname = basename(fileUrl)

    console.log(`  Uploading asset to Sanity: ${fname}`)
    const asset = await client.assets.upload('file', buffer, { filename: fname })
    assetCache.set(fileUrl, asset)
    return asset
  } catch (err) {
    console.error(`  Error uploading ${fileUrl}: ${err.message}`)
    return null
  }
}

// 5. Execute Migration
async function migrateAllDownloads() {
  let updatedCount = 0
  let failedCount = 0

  for (const [sanityId, data] of productFilesMap.entries()) {
    const { product, drawings, files3d, zips } = data
    console.log(`\n========================================`)
    console.log(`Processing "${product.title}" (${sanityId})`)
    console.log(`  Drawings: ${drawings.length} | 3D: ${files3d.length} | Zips: ${zips.length}`)

    const technicalDrawings = []
    const sanityFiles3d = []
    const zipFiles = []

    // Upload Technical Drawings (.dwg, .dxf)
    for (let i = 0; i < drawings.length; i++) {
      const d = drawings[i]
      const asset = await uploadOrGetAsset(d.url)
      if (asset) {
        let label = d.title || `${product.title} Technical Drawing`
        if (!label.toUpperCase().includes(product.title.toUpperCase())) {
          label = `${product.title} ${label}`
        }
        technicalDrawings.push({
          _key: `dwg_${d.id}_${i}`,
          title: label,
          file: {
            _type: 'file',
            asset: { _type: 'reference', _ref: asset._id }
          }
        })
      }
    }

    // Upload 3D Files
    for (let i = 0; i < files3d.length; i++) {
      const f = files3d[i]
      const asset = await uploadOrGetAsset(f.url)
      if (asset) {
        let label = f.title || `${product.title} 3D File`
        if (!label.toUpperCase().includes(product.title.toUpperCase())) {
          label = `${product.title} ${label}`
        }
        sanityFiles3d.push({
          _key: `3d_${f.id}_${i}`,
          title: label,
          file: {
            _type: 'file',
            asset: { _type: 'reference', _ref: asset._id }
          }
        })
      }
    }

    // Upload Zip/Revit Files
    for (let i = 0; i < zips.length; i++) {
      const z = zips[i]
      const asset = await uploadOrGetAsset(z.url)
      if (asset) {
        let label = z.title || `${product.title} Revit Archive`
        if (!label.toUpperCase().includes(product.title.toUpperCase())) {
          label = `${product.title} ${label}`
        }
        zipFiles.push({
          _key: `zip_${z.id}_${i}`,
          title: label,
          file: {
            _type: 'file',
            asset: { _type: 'reference', _ref: asset._id }
          }
        })
      }
    }

    // Patch product in Sanity
    const patches = {}
    if (technicalDrawings.length > 0) patches.technicalDrawings = technicalDrawings
    if (sanityFiles3d.length > 0) patches.files3d = sanityFiles3d
    if (zipFiles.length > 0) patches.zipFiles = zipFiles

    if (Object.keys(patches).length > 0) {
      try {
        await client.patch(sanityId).set(patches).commit()
        console.log(`✓ Updated "${product.title}" (${sanityId}) with new download files.`)
        updatedCount++
      } catch (err) {
        console.error(`✗ Patch failed for ${sanityId}: ${err.message}`)
        failedCount++
      }
    }
  }

  console.log(`\n========================================`)
  console.log(`MIGRATION SUMMARY`)
  console.log(`  Updated products: ${updatedCount}`)
  console.log(`  Failed updates: ${failedCount}`)
  console.log(`========================================`)
}

migrateAllDownloads().catch(console.error)
