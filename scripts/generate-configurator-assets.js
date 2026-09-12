import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadedDir = '/Users/lenin.aviles/.gemini/antigravity-ide/brain/30717c2c-e159-4b0b-aa54-f603ff0f7ec7/.user_uploaded'
const outputDir = path.resolve(__dirname, '../public/chair-configurator')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const WOOD_BASES = {
  'bleached-beech': path.join(uploadedDir, 'media_1789242858416.jpg'),
  'oak-h': path.join(uploadedDir, 'media_1789242858428.jpg'),
  'honey': path.join(uploadedDir, 'media_1789242858439.jpg'),
  'natural-beech': path.join(uploadedDir, 'media_1789242858455.jpg'),
}

const RED_BASE = path.join(uploadedDir, 'media_1789242858462.jpg')

async function generateAssets() {
  console.log('Starting chair asset generation...')
  const w = 1024
  const h = 1024

  // Load red reference for cushion mask
  const redRaw = await sharp(RED_BASE).raw().toBuffer({ resolveWithObject: true })

  // Build high precision upholstery mask
  const mask = new Uint8Array(w * h)
  for (let y = 145; y <= 628; y++) {
    for (let x = 200; x <= 780; x++) {
      const idx = (y * w + x) * 3
      const r = redRaw.data[idx]
      const g = redRaw.data[idx + 1]
      const b = redRaw.data[idx + 2]
      if (r > 45 && r > g * 1.25 && r > b * 1.25) {
        mask[y * w + x] = 255
      }
    }
  }

  // Load all 4 wood base raw buffers
  const woodBuffers = {}
  for (const [woodKey, filePath] of Object.entries(WOOD_BASES)) {
    woodBuffers[woodKey] = await sharp(filePath).raw().toBuffer({ resolveWithObject: true })
  }

  const FABRICS = ['1194', '1307', '71', '680']
  const WOODS = ['bleached-beech', 'natural-beech', 'honey', 'oak-h']

  const results = []

  for (const fabric of FABRICS) {
    for (const wood of WOODS) {
      const filename = `chair-${fabric}-${wood}.png`
      const outPath = path.join(outputDir, filename)
      const baseWood = woodBuffers[wood]

      let outBuffer

      if (fabric === '71') {
        // Ground truth 71 is the base wood buffer itself!
        outBuffer = Buffer.from(baseWood.data)
      } else if (fabric === '680') {
        // Red upholstery from RED_BASE composited onto baseWood
        outBuffer = Buffer.from(baseWood.data)
        for (let i = 0; i < w * h; i++) {
          if (mask[i] === 255) {
            outBuffer[i * 3] = redRaw.data[i * 3]
            outBuffer[i * 3 + 1] = redRaw.data[i * 3 + 1]
            outBuffer[i * 3 + 2] = redRaw.data[i * 3 + 2]
          }
        }
      } else if (fabric === '1307') {
        // Rich warm chestnut / terracotta
        outBuffer = Buffer.from(baseWood.data)
        for (let i = 0; i < w * h; i++) {
          if (mask[i] === 255) {
            const yr = baseWood.data[i * 3]
            const yg = baseWood.data[i * 3 + 1]
            const yb = baseWood.data[i * 3 + 2]
            const lum = (0.299 * yr + 0.587 * yg + 0.114 * yb) / 165
            outBuffer[i * 3] = Math.min(255, Math.max(0, Math.round(145 * lum)))
            outBuffer[i * 3 + 1] = Math.min(255, Math.max(0, Math.round(75 * lum)))
            outBuffer[i * 3 + 2] = Math.min(255, Math.max(0, Math.round(50 * lum)))
          }
        }
      } else if (fabric === '1194') {
        // Warm khaki / sand olive-tan
        outBuffer = Buffer.from(baseWood.data)
        for (let i = 0; i < w * h; i++) {
          if (mask[i] === 255) {
            const yr = baseWood.data[i * 3]
            const yg = baseWood.data[i * 3 + 1]
            const yb = baseWood.data[i * 3 + 2]
            const lum = (0.299 * yr + 0.587 * yg + 0.114 * yb) / 165
            outBuffer[i * 3] = Math.min(255, Math.max(0, Math.round(168 * lum)))
            outBuffer[i * 3 + 1] = Math.min(255, Math.max(0, Math.round(142 * lum)))
            outBuffer[i * 3 + 2] = Math.min(255, Math.max(0, Math.round(98 * lum)))
          }
        }
      }

      await sharp(outBuffer, { raw: { width: w, height: h, channels: 3 } })
        .png({ compressionLevel: 8 })
        .toFile(outPath)

      const stat = fs.statSync(outPath)
      results.push({
        filename,
        path: `/chair-configurator/${filename}`,
        sizeBytes: stat.size,
      })
      console.log(`Generated ${filename} (${Math.round(stat.size / 1024)} KB)`)
    }
  }

  console.log(`\nAll ${results.length} combinations successfully generated!`)
}

generateAssets().catch((err) => {
  console.error('Error generating assets:', err)
  process.exit(1)
})
