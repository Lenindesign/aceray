import { createClient } from '@sanity/client'
import { writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2023-08-01',
  useCdn: false
})

async function run() {
  console.log('Fetching products with duplicate PDFs from Sanity...')
  const products = await client.fetch(`*[_type == "product" && count(productPdfs) > 1]{
    _id,
    title,
    "slug": slug.current,
    productPdfs
  }`)

  console.log(`Found ${products.length} products with multiple PDF links.`)
  const patches = {}
  const auditReport = []

  let processed = 0
  for (const product of products) {
    processed++
    const url = `https://aceray.com/product/${product.slug}/`
    console.log(`[${processed}/${products.length}] Auditing ${product.title} (${product.slug})...`)

    let livePdfUrl = null
    let retrievalMethod = 'none'

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(6000) })
      if (res.ok) {
        const html = await res.text()
        // Extract all PDF links in hrefs
        const matches = [...html.matchAll(/href=["'](https?:\/\/[^"'\s>]+?\.pdf)["']/gi)].map(m => m[1])
        const uploadsPdfs = matches.filter(link => link.includes('/wp-content/uploads/'))
        
        if (uploadsPdfs.length > 0) {
          // Find the one that matches the product slug or code best, or the first one
          // Most products have exactly one PDF link on the page
          livePdfUrl = uploadsPdfs[0]
          retrievalMethod = 'live page lookup'
        }
      } else {
        console.warn(`    HTTP status ${res.status} for ${url}`)
      }
    } catch (e) {
      console.warn(`    Failed to fetch ${url}: ${e.message}`)
    }

    let selectedPdf = null
    let selectionReason = ''

    if (livePdfUrl) {
      // Find the PDF in productPdfs that matches this URL (ignoring minor encoding differences)
      const normalizedLive = livePdfUrl.toLowerCase().replace(/%20/g, ' ').trim()
      selectedPdf = product.productPdfs.find(pdf => {
        const normalizedSource = (pdf.sourceUrl || '').toLowerCase().replace(/%20/g, ' ').trim()
        return normalizedSource.endsWith(normalizedLive.substring(normalizedLive.indexOf('/wp-content/'))) || 
               normalizedLive.endsWith(normalizedSource.substring(normalizedSource.indexOf('/wp-content/')))
      })
      
      if (selectedPdf) {
        selectionReason = `Matched live URL on aceray.com: ${livePdfUrl}`
      }
    }

    if (!selectedPdf) {
      // Fallback: choose the newest upload PDF by extracting the year/month from the sourceUrl
      // uploads URLs usually look like /uploads/YYYY/MM/name.pdf
      const sorted = [...product.productPdfs].sort((a, b) => {
        const dateA = extractDateFromUrl(a.sourceUrl)
        const dateB = extractDateFromUrl(b.sourceUrl)
        if (dateA !== dateB) return dateB - dateA // newest first
        // If same date, fallback to length or naming (shorter names without suffixes first)
        return (a.sourceUrl || '').length - (b.sourceUrl || '').length
      })
      selectedPdf = sorted[0]
      selectionReason = livePdfUrl 
        ? `Live URL was ${livePdfUrl} but no match in Sanity. Selected latest upload date fallback.` 
        : `Product page failed to load or had no PDFs. Selected latest upload date fallback.`
    }

    const removedPdfs = product.productPdfs.filter(pdf => pdf._key !== selectedPdf._key)
    
    auditReport.push({
      productId: product._id,
      title: product.title,
      slug: product.slug,
      retrievalMethod,
      livePdfUrl,
      selectionReason,
      selectedPdf: {
        title: selectedPdf.title,
        sourceUrl: selectedPdf.sourceUrl,
        _key: selectedPdf._key
      },
      removedPdfs: removedPdfs.map(pdf => ({
        title: pdf.title,
        sourceUrl: pdf.sourceUrl
      }))
    })

    // Construct the Sanity patch format: replace productPdfs with array containing only selectedPdf
    patches[product._id] = {
      patches: [
        {
          set: {
            productPdfs: [selectedPdf]
          }
        }
      ]
    }
  }

  const outPath = resolve('scratch/pdf-deduplication-patches.json')
  const reportPath = resolve('scratch/pdf-deduplication-report.json')
  
  writeFileSync(outPath, JSON.stringify(patches, null, 2))
  writeFileSync(reportPath, JSON.stringify(auditReport, null, 2))

  console.log(`\nCompleted. Wrote patches to: ${outPath}`)
  console.log(`Wrote report to: ${reportPath}`)
}

function extractDateFromUrl(url = '') {
  // Extract YYYY/MM from url like "https://aceray.com/wp-content/uploads/2026/01/Arte-3UU.pdf"
  const match = url.match(/\/uploads\/(\d{4})\/(\d{2})\//)
  if (match) {
    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    return year * 12 + month // returns absolute month index for comparisons
  }
  return 0
}

run().catch(console.error)
