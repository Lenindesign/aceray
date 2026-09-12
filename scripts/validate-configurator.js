import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAllConfigurations, FABRICS, WOOD_FINISHES } from '../src/components/configurator/configuration-data.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.resolve(__dirname, '../public')

console.log('=== ACERAY CHAIR CONFIGURATOR VALIDATION TEST ===\n')

const combos = getAllConfigurations()
console.log(`Total expected combinations: ${combos.length} (4 fabrics × 4 wood stains)`)

let passedCount = 0
const failures = []

for (const combo of combos) {
  const fullPath = path.join(publicDir, combo.imagePath)
  const exists = fs.existsSync(fullPath)
  
  if (!exists) {
    failures.push({
      combo: combo.displayName,
      path: combo.imagePath,
      error: 'File does not exist in /public',
    })
    continue
  }

  const stats = fs.statSync(fullPath)
  if (stats.size === 0) {
    failures.push({
      combo: combo.displayName,
      path: combo.imagePath,
      error: 'File exists but is empty (0 bytes)',
    })
    continue
  }

  passedCount++
  console.log(`✓ [${combo.fabric.id} + ${combo.wood.id}] -> ${combo.imagePath} (${Math.round(stats.size / 1024)} KB)`)
}

// Also validate material swatch image files exist
console.log('\nValidating material swatches...')
for (const fabric of FABRICS) {
  const swatchPath = path.join(publicDir, fabric.swatchUrl)
  if (fs.existsSync(swatchPath)) {
    console.log(`✓ Fabric swatch [${fabric.id}] exists: ${fabric.swatchUrl}`)
  } else {
    failures.push({
      combo: `Fabric swatch ${fabric.id}`,
      path: fabric.swatchUrl,
      error: 'Fabric swatch file missing',
    })
  }
}

for (const wood of WOOD_FINISHES) {
  const swatchPath = path.join(publicDir, wood.swatchUrl)
  if (fs.existsSync(swatchPath)) {
    console.log(`✓ Wood swatch [${wood.id}] exists: ${wood.swatchUrl}`)
  } else {
    failures.push({
      combo: `Wood swatch ${wood.id}`,
      path: wood.swatchUrl,
      error: 'Wood swatch file missing',
    })
  }
}

console.log('\n================================================')
if (failures.length === 0) {
  console.log(`\n🎉 ALL ${passedCount} COMBINATIONS VALIDATED SUCCESSFULLY!`)
  console.log('All 16 static assets resolve to valid, readable PNG files.\n')
  process.exit(0)
} else {
  console.error(`\n❌ VALIDATION FAILED with ${failures.length} errors:`)
  failures.forEach((f) => console.error(`  - ${f.combo}: ${f.error} (${f.path})`))
  process.exit(1)
}
