import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, basename } from 'node:path'

const TARGET_FILES = [
  'src/lib/productFamilies.js',
  'src/pages/HomePage.jsx',
  'src/pages/AboutPage.jsx',
  'src/pages/FabricsFinishesPage.jsx',
]

const OUTPUT_DIR = resolve('public/assets/migrated')
mkdirSync(OUTPUT_DIR, { recursive: true })

async function downloadAsset(url) {
  let filename = basename(new URL(url).pathname)
  // sanitize filename
  filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const destPath = resolve(OUTPUT_DIR, filename)
  const localUrlPath = `/assets/migrated/${filename}`

  if (!existsSync(destPath)) {
    try {
      console.log(`Downloading: ${url} -> ${filename}`)
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      writeFileSync(destPath, buffer)
    } catch (e) {
      console.error(`Failed to download ${url}: ${e.message}`)
      return url // fallback to original if download failed
    }
  }

  return localUrlPath
}

async function run() {
  console.log('Starting migration of hardcoded aceray.com assets...')
  const urlMap = new Map()

  // Collect all aceray.com image URLs
  for (const relativePath of TARGET_FILES) {
    const fullPath = resolve(relativePath)
    const content = readFileSync(fullPath, 'utf8')
    const matches = content.match(/https:\/\/aceray\.com\/wp-content\/uploads\/[^"'\s\)]+/gi) || []
    for (const url of matches) {
      urlMap.set(url, null)
    }
  }

  console.log(`Found ${urlMap.size} unique hardcoded asset URLs to migrate.`)

  // Download all assets
  for (const url of urlMap.keys()) {
    const localPath = await downloadAsset(url)
    urlMap.set(url, localPath)
  }

  // Rewrite target files
  for (const relativePath of TARGET_FILES) {
    const fullPath = resolve(relativePath)
    let content = readFileSync(fullPath, 'utf8')
    let replacedCount = 0

    for (const [url, localPath] of urlMap.entries()) {
      if (localPath && content.includes(url)) {
        content = content.replaceAll(url, localPath)
        replacedCount++
      }
    }

    writeFileSync(fullPath, content)
    console.log(`Updated ${relativePath} (${replacedCount} URLs replaced).`)
  }

  console.log('\nHardcoded asset migration complete!')
}

run().catch(console.error)
