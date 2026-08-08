import { DOMParser } from '@xmldom/xmldom'
import { readFileSync } from 'node:fs'

const xmlPath = "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml"
const xml = readFileSync(xmlPath, 'utf8')
const doc = new DOMParser().parseFromString(xml, 'text/xml')
const items = Array.from(doc.getElementsByTagName('item'))

function getText(item, tag) {
  const el = item.getElementsByTagName(tag)[0]
  return el ? el.textContent : ''
}

const rivaItems = items.filter(item => {
  const title = getText(item, 'title')
  const postName = getText(item, 'wp:post_name')
  return title.toUpperCase().includes('RIVA') || postName.toUpperCase().includes('RIVA')
})

console.log(`Found ${rivaItems.length} RIVA items in WordPress XML.`)

rivaItems.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  const postId = getText(item, 'wp:post_id')
  const postParent = getText(item, 'wp:post_parent')
  const title = getText(item, 'title')
  const attachmentUrl = getText(item, 'wp:attachment_url')
  
  if (postType === 'product' || postType === 'attachment') {
    console.log(`\n--- [${postType.toUpperCase()}] ID: ${postId} | Parent: ${postParent} | Title: ${title} ---`)
    if (attachmentUrl) console.log(`Attachment URL: ${attachmentUrl}`)

    const postmetas = Array.from(item.getElementsByTagName('wp:postmeta'))
    postmetas.forEach(pm => {
      const key = getText(pm, 'wp:meta_key')
      const val = getText(pm, 'wp:meta_value')
      if (key.includes('pdf') || key.includes('file') || key.includes('download') || key.includes('media') || key.includes('3d')) {
        console.log(`  meta: ${key} = ${val}`)
      }
    })
  }
})
