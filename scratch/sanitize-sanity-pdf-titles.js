import { createClient } from '@sanity/client'

const token = 'skQMw1kGUxFSR48jrhIR4PjQf67yxwuUSFSp2DLfAsPT0NWCFvjikQvO0VTMJAEG5Txk91wjODIDfb953'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function sanitizePdfTitles() {
  console.log('Fetching products with productPdfs containing "PDF File" titles...')
  const products = await client.fetch(`*[_type == "product" && count(productPdfs) > 0] {
    _id, title, productPdfs
  }`)

  console.log(`Found ${products.length} products with PDFs. Inspecting titles...`)
  let updatedCount = 0

  for (const product of products) {
    if (!Array.isArray(product.productPdfs)) continue
    let needsUpdate = false
    const updatedPdfs = product.productPdfs.map(pdf => {
      if (pdf.title && pdf.title.includes('PDF File')) {
        needsUpdate = true
        return {
          ...pdf,
          title: pdf.title.replace(/\s*PDF\s*File$/i, ' Spec Sheet')
        }
      }
      return pdf
    })

    if (needsUpdate) {
      await client.patch(product._id).set({ productPdfs: updatedPdfs }).commit()
      updatedCount++
      console.log(`Updated product ${product.title} (${product._id})`)
    }
  }

  console.log(`Done! Updated ${updatedCount} products in Sanity database.`)
}

sanitizePdfTitles().catch(err => {
  console.error(err)
  process.exit(1)
})
