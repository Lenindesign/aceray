import { createClient } from '@sanity/client'
import { DOMParser } from '@xmldom/xmldom'
import { readFileSync, writeFileSync } from 'node:fs'
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
    if (id && url) {
      attachmentMap.set(id, { id, url, title })
    }
  }
})

console.log(`Indexed ${attachmentMap.size} attachment IDs from WordPress XML.`)

// 2. Build product ID -> exact PDF URLs map from postmeta
const productPdfMap = new Map()
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'product') {
    const wpId = getText(item, 'wp:post_id')
    const title = getText(item, 'title')
    const postName = getText(item, 'wp:post_name')
    const sanityId = `wp-product-${wpId}`

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
        productPdfMap.set(sanityId, {
          wpId,
          sanityId,
          title,
          slug: postName,
          pdfs: resolvedPdfs
        })
      }
    }
  }
})

console.log(`Found exact WordPress postmeta PDF mappings for ${productPdfMap.size} products.`)

// Output sample for RIVA-7SL
const sample = Array.from(productPdfMap.values()).find(p => p.title.toUpperCase().includes('RIVA-7SL'))
console.log('\nSample mapping for RIVA-7SL:', JSON.stringify(sample, null, 2))
