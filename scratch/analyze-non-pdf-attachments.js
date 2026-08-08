import { DOMParser } from '@xmldom/xmldom'
import { readFileSync } from 'fs'

const xmlPath = "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml"
const xml = readFileSync(xmlPath, 'utf8')
const doc = new DOMParser().parseFromString(xml, 'text/xml')
const items = Array.from(doc.getElementsByTagName('item'))

function getText(item, tag) {
  const el = item.getElementsByTagName(tag)[0]
  return el ? el.textContent : ''
}

// Map products by wp:post_id
const productsById = {}
const productsByTitle = {}
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'product') {
    const id = getText(item, 'wp:post_id')
    const title = getText(item, 'title').trim()
    const slug = getText(item, 'wp:post_name').trim()
    const pObj = { id, title, slug, dwg: [], zip: [], dxf: [], other: [] }
    productsById[id] = pObj
    productsByTitle[title.toUpperCase()] = pObj
  }
})

console.log(`Found ${Object.keys(productsById).length} products in WordPress XML.`)

let matchedByParent = 0
let matchedByTitle = 0

items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'attachment') {
    const parentId = getText(item, 'wp:post_parent')
    const url = getText(item, 'wp:attachment_url')
    const title = getText(item, 'title').trim()
    const ext = url.split('.').pop().toLowerCase()

    if (['dwg', 'zip', 'dxf', 'skp', 'step', 'obj', 'fbx', 'stl', 'rvt', '3ds', '7z'].includes(ext)) {
      let product = productsById[parentId]
      if (product) {
        matchedByParent++
      } else {
        // Try matching by title prefix (e.g. RIVA-3RSL in filename/title)
        const filename = url.split('/').pop().split('.')[0].toUpperCase()
        // Try to match product title
        for (const [pTitle, pObj] of Object.entries(productsByTitle)) {
          if (filename.startsWith(pTitle) || filename.includes(pTitle)) {
            product = pObj
            matchedByTitle++
            break
          }
        }
      }

      if (product) {
        const fileObj = { title: title || url.split('/').pop(), url, ext }
        if (ext === 'dwg' || ext === 'dxf') product.dwg.push(fileObj)
        else if (ext === 'zip' || ext === '7z' || ext === 'rvt') product.zip.push(fileObj)
        else product.other.push(fileObj)
      }
    }
  }
})

console.log(`Matched ${matchedByParent} by post_parent, ${matchedByTitle} by filename/title match.`)

// Let's inspect a few products:
console.log('\n--- RIVA-3RSL sample ---')
const riva3rsl = Object.values(productsById).find(p => p.title.toUpperCase() === 'RIVA-3RSL')
console.log(JSON.stringify(riva3rsl, null, 2))

// Count products with DWG or ZIP files
const withDwg = Object.values(productsById).filter(p => p.dwg.length > 0)
const withZip = Object.values(productsById).filter(p => p.zip.length > 0)
console.log(`Products with DWG/DXF: ${withDwg.length}`)
console.log(`Products with ZIP/RVT: ${withZip.length}`)
