import { createClient } from '@sanity/client'

const token = 'skQMw1kGUxFSR48jrhIR4PjQf67yxwuUSFSp2DLfAsPT0NWCFvjikQvO0VTMJAEG5Txk91wjODIDfb953'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2023-08-01',
  token,
  useCdn: false
})

async function run() {
  console.log('Fetching all Sanity products to sanitize legacy aceray.com database URLs...')

  const products = await client.fetch(`*[_type == "product"] {
    _id,
    title,
    imageUrl,
    galleryUrls,
    "mainCdnUrl": mainImage.asset->url,
    "galleryCdnUrls": gallery[].asset->url,
    productPdfs[]{
      _key,
      title,
      sourceUrl,
      "cdnUrl": file.asset->url
    }
  }`)

  console.log(`Fetched ${products.length} products. Checking for legacy aceray.com URLs...`)

  let updatedCount = 0

  for (const product of products) {
    const patch = client.patch(product._id)
    let needsPatch = false

    // 1. Sanitize imageUrl
    if (product.imageUrl && product.imageUrl.includes('aceray.com')) {
      if (product.mainCdnUrl) {
        patch.set({ imageUrl: product.mainCdnUrl })
      } else {
        patch.unset(['imageUrl'])
      }
      needsPatch = true
    }

    // 2. Sanitize galleryUrls
    if (product.galleryUrls && product.galleryUrls.some(u => u && u.includes('aceray.com'))) {
      if (product.galleryCdnUrls && product.galleryCdnUrls.length > 0) {
        patch.set({ galleryUrls: product.galleryCdnUrls })
      } else {
        patch.unset(['galleryUrls'])
      }
      needsPatch = true
    }

    // 3. Sanitize productPdfs[].sourceUrl
    if (product.productPdfs && product.productPdfs.length > 0) {
      let pdfsModified = false
      const updatedPdfs = product.productPdfs.map(pdf => {
        if (pdf.sourceUrl && pdf.sourceUrl.includes('aceray.com') && pdf.cdnUrl) {
          pdfsModified = true
          return { ...pdf, sourceUrl: pdf.cdnUrl, cdnUrl: undefined }
        }
        const copy = { ...pdf }
        delete copy.cdnUrl
        return copy
      })

      if (pdfsModified) {
        patch.set({ productPdfs: updatedPdfs })
        needsPatch = true
      }
    }

    if (needsPatch) {
      try {
        await patch.commit()
        updatedCount++
        if (updatedCount % 50 === 0 || updatedCount === 1) {
          console.log(`  ✓ Updated ${updatedCount} products so far... (${product.title})`)
        }
      } catch (e) {
        console.error(`Failed to patch product ${product._id}: ${e.message}`)
      }
    }
  }

  console.log(`\nSanitization complete! Updated ${updatedCount} products in Sanity.`)
}

run().catch(console.error)
