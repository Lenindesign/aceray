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

const matches = []
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'attachment') {
    const id = getText(item, 'wp:post_id')
    const url = getText(item, 'wp:attachment_url')
    const title = getText(item, 'title')
    if (id && url && /\.pdf(?:$|\?)/i.test(url)) {
      if (url.toLowerCase().includes('3rsl') || title.toLowerCase().includes('3rsl')) {
        matches.push({ id, title, url })
      }
    }
  }
})

console.log(`Found ${matches.length} matches for 3RSL in WordPress export:`)
matches.forEach(m => console.log(` - ID: ${m.id} | Title: "${m.title}" | URL: ${m.url}`))
