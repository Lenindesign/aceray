import { writeFileSync } from 'node:fs'

async function verify() {
  const sanityUrl = "https://cdn.sanity.io/files/xm9au2qy/production/ebf31f294fbe32fd7848b1849b959fb02eee1a75.pdf"
  const cadUrl = "https://aceray.com/wp-content/uploads/2023/01/RIVA-3RSL.pdf"
  const specUrl = "https://aceray.com/wp-content/uploads/2023/01/RIVA-3RSL-Armchair.pdf"

  const sanityBuf = Buffer.from(await (await fetch(sanityUrl)).arrayBuffer())
  const cadBuf = Buffer.from(await (await fetch(cadUrl)).arrayBuffer())
  const specBuf = Buffer.from(await (await fetch(specUrl)).arrayBuffer())

  console.log(`Sanity asset size: ${sanityBuf.length}`)
  console.log(`CAD url size: ${cadBuf.length}`)
  console.log(`SPEC url size: ${specBuf.length}`)

  if (sanityBuf.length === cadBuf.length) {
    console.log('===> MATCH: Sanity asset is the CAD line drawing!')
  } else if (sanityBuf.length === specBuf.length) {
    console.log('===> MATCH: Sanity asset is the FULL-COLOR SPEC SHEET!')
  } else {
    console.log('===> NO EXACT SIZE MATCH')
  }
}

verify().catch(console.error)
