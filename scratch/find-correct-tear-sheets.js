import { DOMParser } from '@xmldom/xmldom'
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const xmlPath = "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml"
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

console.log(`Found total ${pdfAttachments.length} PDF attachments in WordPress export XML.`)

// Filter RIVA PDFs
const rivaPdfs = pdfAttachments.filter(p => p.url.toUpperCase().includes('RIVA') || p.title.toUpperCase().includes('RIVA'))
console.log('\nAll RIVA PDF attachments in WordPress:')
rivaPdfs.forEach(p => console.log(` - ID: ${p.id} | Title: "${p.title}" | URL: ${p.url}`))
