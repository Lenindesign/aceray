import { writeFileSync } from 'node:fs'

async function inspectPdfs() {
  const url1 = "https://aceray.com/wp-content/uploads/2023/01/RIVA-3RSL.pdf"
  const url2 = "https://aceray.com/wp-content/uploads/2023/01/RIVA-3RSL-Armchair.pdf"

  const res1 = await fetch(url1)
  const buf1 = Buffer.from(await res1.arrayBuffer())

  const res2 = await fetch(url2)
  const buf2 = Buffer.from(await res2.arrayBuffer())

  console.log(`URL1 (${url1}): size = ${buf1.length} bytes`)
  console.log(`URL2 (${url2}): size = ${buf2.length} bytes`)

  // Check text inside PDF stream
  const txt1 = buf1.toString('utf8')
  const txt2 = buf2.toString('utf8')

  console.log('\nURL1 text snippets:', txt1.substring(0, 500).replace(/[\r\n]+/g, ' '))
  console.log('\nURL2 text snippets:', txt2.substring(0, 500).replace(/[\r\n]+/g, ' '))
}

inspectPdfs().catch(console.error)
