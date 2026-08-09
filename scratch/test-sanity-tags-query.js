import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function run() {
  console.log('--- Testing GROQ query for opt.media.tags ---')
  const taggedImages = await client.fetch(`*[_type == "sanity.imageAsset" && (
    "installation" in opt.media.tags[]->name.current ||
    isInstallation == true ||
    "installation" in tags[]->name.current
  )] {
    _id,
    url,
    originalFilename,
    title,
    projectName,
    "tagName": opt.media.tags[]->name.current
  }`)
  console.log(`Found ${taggedImages.length} tagged installation images:`)
  console.log(JSON.stringify(taggedImages, null, 2))
}

run().catch(console.error)
