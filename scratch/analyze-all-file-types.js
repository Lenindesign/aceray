import { DOMParser } from '@xmldom/xmldom'
import { readFileSync } from 'fs'

const xmlPath = "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml"
const xml = readFileSync(xmlPath, 'utf8')
const doc = new DOMParser().parseFromString(xml, 'text/xml')
const items = Array.from(doc.getElementsByTagName('item'))

function getText(item, tag) {
  const el = item.getElementsByTagName(tag)[0]
  return el ? el.textContent.trim() : ''
}

// Map products by wp:post_id
const productsByWpId = new Map()
const productsByTitle = new Map()
const productsBySlug = new Map()

items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'product') {
    const wpId = getText(item, 'wp:post_id')
    const title = getText(item, 'title')
    const slug = getText(item, 'wp:post_name')

    const productObj = {
      wpId,
      title,
      slug,
      technicalDrawings: [], // dwg, dxf
      files3d: [],           // step, stp, obj, skp, 3ds, fbx, iges, stl
      zipFiles: []           // zip, rar, 7z, rvt
    }

    productsByWpId.set(wpId, productObj)
    if (title) productsByTitle.set(title.toUpperCase(), productObj)
    if (slug) productsBySlug.set(slug.toLowerCase(), productObj)
  }
})

// Check attachment items
let totalAttachments = 0
items.forEach(item => {
  const postType = getText(item, 'wp:post_type')
  if (postType === 'attachment') {
    const parentId = getText(item, 'wp:post_parent')
    const url = getText(item, 'wp:attachment_url')
    const title = getText(item, 'title')
    if (!url) return

    const extMatch = url.match(/\.([a-zA-Z0-9]+)(?:$|\?)/)
    if (!extMatch) return
    const ext = extMatch[1].toLowerCase()

    if (['dwg', 'dxf', 'zip', 'rar', '7z', 'rvt', 'step', 'stp', 'obj', 'skp', '3ds', 'fbx', 'iges', 'stl'].includes(ext)) {
      totalAttachments++
      let product = productsByWpId.get(parentId)

      if (!product) {
        // Filename matching fallback
        const filename = url.split('/').pop().replace(/\.[^/.]+$/, "").toUpperCase()
        for (const [pTitle, pObj] of productsByTitle.entries()) {
          if (filename.startsWith(pTitle) || filename.includes(pTitle)) {
            product = pObj
            break
          }
        }
      }

      if (product) {
        const itemObj = { title: title || url.split('/').pop(), url, ext }
        if (['dwg', 'dxf'].includes(ext)) {
          product.technicalDrawings.push(itemObj)
        } else if (['zip', 'rar', '7z', 'rvt'].includes(ext)) {
          product.zipFiles.push(itemObj)
        } else {
          product.files3d.push(itemObj)
        }
      }
    }
  }
})

console.log(`Indexed ${totalAttachments} non-PDF attachments.`)

let countTech = 0
let count3d = 0
let countZip = 0

for (const p of productsByWpId.values()) {
  if (p.technicalDrawings.length) countTech++
  if (p.files3d.length) count3d++
  if (p.zipFiles.length) countZip++
}

console.log(`Products with Technical Drawings (DWG/DXF): ${countTech}`)
console.log(`Products with 3D Files (STEP/OBJ/SKP/3DS/FBX/STL): ${count3d}`)
console.log(`Products with Zip/Archives (ZIP/RAR/7Z/RVT): ${countZip}`)

// Sample print
const sampleRiva = productsBySlug.get('riva-3rsl')
console.log('\nSample RIVA-3RSL downloads:')
console.log(JSON.stringify(sampleRiva, null, 2))
