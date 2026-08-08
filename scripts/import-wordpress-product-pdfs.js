#!/usr/bin/env node
import {createClient} from '@sanity/client'
import {DOMParser} from '@xmldom/xmldom'
import {createHash} from 'node:crypto'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {basename, resolve} from 'node:path'

const DEFAULT_XML =
  "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml"

const args = process.argv.slice(2)
const commit = args.includes('--commit')
const xmlArg = args.find((arg) => !arg.startsWith('--'))
const xmlPath = resolve(xmlArg || DEFAULT_XML)
const localProductsPath = resolve('sanity-products.ndjson')
const reportsDir = resolve('output/migrations')
const reportPath = resolve(reportsDir, 'wordpress-product-pdfs-report.json')

if (!existsSync(xmlPath)) {
  console.error(`XML export not found: ${xmlPath}`)
  process.exit(1)
}

if (commit && !process.env.SANITY_TOKEN) {
  console.error('SANITY_TOKEN is required when running with --commit.')
  process.exit(1)
}

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

console.log(`Reading WordPress export: ${xmlPath}`)
const xml = readFileSync(xmlPath, 'utf8')
const doc = new DOMParser().parseFromString(xml, 'text/xml')
const items = Array.from(doc.getElementsByTagName('item'))

const pdfs = collectPdfAttachments(items)
console.log(`Found ${pdfs.length} unique PDF attachment URLs.`)

const products = await getProducts()

const matches = matchPdfsToProducts(pdfs, products)
const report = {
  mode: commit ? 'commit' : 'dry-run',
  xmlPath,
  pdfCount: pdfs.length,
  productCount: products.length,
  matchedCount: matches.length,
  unmatchedCount: pdfs.length - matches.length,
  matches: matches.map(({pdf, product, reason, score}) => ({
    pdfTitle: pdf.title,
    pdfUrl: pdf.url,
    productTitle: product.title,
    productSlug: product.slug,
    reason,
    score,
  })),
  unmatched: pdfs
    .filter((pdf) => !matches.some((match) => match.pdf.url === pdf.url))
    .map((pdf) => ({title: pdf.title, url: pdf.url})),
}

mkdirSync(reportsDir, {recursive: true})
writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(`Wrote report: ${reportPath}`)

if (!commit) {
  console.log('\nDry run complete. Review the report, then run with --commit to upload and patch products.')
  process.exit(0)
}

let patched = 0
let skippedExisting = 0
let failed = 0

for (const match of matches) {
  const existingUrls = new Set((match.product.productPdfs || []).map((pdf) => pdf.sourceUrl).filter(Boolean))
  if (existingUrls.has(match.pdf.url)) {
    skippedExisting++
    continue
  }

  try {
    console.log(`Uploading PDF for ${match.product.title}: ${match.pdf.url}`)
    const asset = await uploadPdf(match.pdf.url)
    const pdfObject = {
      _key: stableKey(match.pdf.url),
      _type: 'object',
      title: makePdfTitle(match.pdf, match.product),
      sourceUrl: match.pdf.url,
      file: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
    }

    await client
      .patch(match.product._id)
      .setIfMissing({productPdfs: []})
      .append('productPdfs', [pdfObject])
      .commit()

    patched++
  } catch (error) {
    failed++
    console.error(`Failed ${match.pdf.url}: ${error.message}`)
  }
}

console.log(`Done. Patched ${patched} products. Skipped ${skippedExisting} existing links. Failed ${failed}.`)

function collectPdfAttachments(items) {
  const byUrl = new Map()

  for (const item of items) {
    const postType = getText(item, 'wp:post_type')
    const attachmentUrl = getText(item, 'wp:attachment_url')
    if (postType !== 'attachment' || !/\.pdf(?:$|\?)/i.test(attachmentUrl)) continue

    const title = getText(item, 'title') || decodeFilename(attachmentUrl)
    byUrl.set(attachmentUrl, {
      title,
      url: attachmentUrl,
      filename: decodeFilename(attachmentUrl),
      stem: stripExtension(decodeFilename(attachmentUrl)),
    })
  }

  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url))
}

async function getProducts() {
  try {
    return await client.fetch(`*[_type == "product"]{
      _id,
      title,
      "slug": slug.current,
      productPdfs[]{title, sourceUrl}
    }`)
  } catch (error) {
    if (commit) throw error
    if (!existsSync(localProductsPath)) throw error

    console.warn(`Could not reach Sanity API (${error.message}). Using local ${localProductsPath}.`)
    return readFileSync(localProductsPath, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const product = JSON.parse(line)
        return {
          _id: product._id,
          title: product.title,
          slug: product.slug?.current,
          productPdfs: product.productPdfs || [],
        }
      })
  }
}

function matchPdfsToProducts(pdfs, products) {
  const matches = []

  for (const pdf of pdfs) {
    const pdfTokens = normalizedTokens(pdf.stem)
    const pdfCode = normalizeCode(pdf.stem)
    let best = null

    for (const product of products) {
      const productCode = normalizeCode(product.title)
      const productSlugCode = normalizeCode(product.slug)
      const productTokens = normalizedTokens(`${product.title} ${product.slug}`)

      let score = 0
      const reasons = []

      if (pdfCode && productCode && pdfCode === productCode) {
        score += 100
        reasons.push('exact product title code')
      }

      if (pdfCode && productSlugCode && pdfCode === productSlugCode) {
        score += 95
        reasons.push('exact product slug code')
      }

      if (productCode && pdfTokens.has(productCode)) {
        score += 85
        reasons.push('filename contains product title code')
      }

      if (productSlugCode && pdfTokens.has(productSlugCode)) {
        score += 80
        reasons.push('filename contains product slug code')
      }

      const sharedTokens = [...productTokens].filter((token) => pdfTokens.has(token))
      if (sharedTokens.length > 0) {
        score += Math.min(sharedTokens.length * 8, 40)
        reasons.push(`shared tokens: ${sharedTokens.slice(0, 4).join(', ')}`)
      }

      if (score > 0 && (!best || score > best.score)) {
        best = {pdf, product, score, reason: reasons.join('; ')}
      }
    }

    if (best && best.score >= 80) matches.push(best)
  }

  return matches
}

async function uploadPdf(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const filename = decodeFilename(url)
  const buffer = Buffer.from(await response.arrayBuffer())
  return client.assets.upload('file', buffer, {
    filename,
    contentType: response.headers.get('content-type') || 'application/pdf',
  })
}

function makePdfTitle(pdf, product) {
  const title = pdf.title || stripExtension(pdf.filename)
  if (/pdf|spec|sheet/i.test(title)) return title
  return `${product.title} PDF File`
}

function getText(parent, tagName) {
  const parts = tagName.split(':')
  let nodes
  if (parts.length === 2) {
    const nsMap = {
      wp: 'http://wordpress.org/export/1.2/',
      content: 'http://purl.org/rss/1.0/modules/content/',
    }
    nodes = parent.getElementsByTagNameNS(nsMap[parts[0]] || '', parts[1])
  } else {
    nodes = parent.getElementsByTagName(tagName)
  }
  if (!nodes || nodes.length === 0) return ''
  return (nodes[0].textContent || '').trim()
}

function decodeFilename(url) {
  try {
    return decodeURIComponent(basename(new URL(url).pathname))
  } catch {
    return basename(url)
  }
}

function stripExtension(filename) {
  return filename.replace(/\.[^.]+$/, '')
}

function normalizeCode(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/^aceray[-_\s]*/i, '')
    .replace(/spec[-_\s]*sheet/gi, '')
    .replace(/^#/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizedTokens(value = '') {
  const normalized = normalizeCode(value)
  const tokens = normalized.split('-').filter((token) => token.length >= 2)
  const joined = tokens.join('-')
  return new Set([...tokens, joined].filter(Boolean))
}

function stableKey(value) {
  return `pdf_${createHash('sha1').update(value).digest('hex').slice(0, 16)}`
}
