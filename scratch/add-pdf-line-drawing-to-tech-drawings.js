import { createClient } from '@sanity/client'

const token = 'skQMw1kGUxFSR48jrhIR4PjQf67yxwuUSFSp2DLfAsPT0NWCFvjikQvO0VTMJAEG5Txk91wjODIDfb953'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function addTechDrawingPdf() {
  const url = "https://aceray.com/wp-content/uploads/2023/01/RIVA-3RSL.pdf"
  console.log(`Downloading technical drawing PDF: ${url}`)
  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())

  console.log('Uploading asset to Sanity...')
  const asset = await client.assets.upload('file', buffer, {
    filename: 'RIVA-3RSL-technical-drawing.pdf'
  })

  console.log(`Asset uploaded: ${asset.url}`)

  const product = await client.fetch('*[_type == "product" && slug.current == "riva-3rsl"][0]{ _id, technicalDrawings }')
  
  // Clean up existing technical drawings to avoid duplicates, and add the PDF technical drawing
  const newTechDrawings = [
    {
      _key: 'riva_3rsl_dwg_1',
      title: 'RIVA-3RSL-1.dwg',
      file: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: 'file-c8dfe3f7daaa53505bddac49828f48326da064b2-dwg'
        }
      }
    },
    {
      _key: 'riva_3rsl_pdf_tech_drawing',
      title: 'RIVA-3RSL Technical Drawing.pdf',
      file: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    }
  ]

  await client.patch(product._id).set({ technicalDrawings: newTechDrawings }).commit()
  console.log('✓ Successfully added RIVA-3RSL technical drawing PDF to Technical Drawings section!')
}

addTechDrawingPdf().catch(console.error)
