import { createClient } from '@sanity/client'
import { basename } from 'node:path'

const token = 'skQMw1kGUxFSR48jrhIR4PjQf67yxwuUSFSp2DLfAsPT0NWCFvjikQvO0VTMJAEG5Txk91wjODIDfb953'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function fixRiva3rslSpecSheet() {
  const url = "https://aceray.com/wp-content/uploads/2023/01/RIVA-3RSL-Armchair.pdf"
  console.log(`Downloading full-color spec sheet: ${url}`)
  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())

  console.log(`Uploading to Sanity...`)
  const asset = await client.assets.upload('file', buffer, {
    filename: 'RIVA-3RSL_spec_sheet.pdf'
  })

  console.log(`Asset uploaded! URL: ${asset.url}`)

  const productPdfs = [
    {
      _key: 'riva_3rsl_spec_correct',
      title: 'RIVA-3RSL Spec Sheet',
      sourceUrl: asset.url,
      file: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    }
  ]

  await client.patch('wp-product-26565').set({ productPdfs }).commit()
  console.log('✓ Successfully updated RIVA-3RSL with the correct full-color spec sheet PDF!')
}

fixRiva3rslSpecSheet().catch(console.error)
