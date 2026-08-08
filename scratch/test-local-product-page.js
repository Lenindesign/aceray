async function checkLocalPage() {
  // Query Sanity directly as ProductPage.jsx does
  const { createClient } = await import('@sanity/client')
  const client = createClient({
    projectId: 'xm9au2qy',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false
  })

  const query = `*[_type == "product" && slug.current == "riva-3rsl"][0]{
    _id, title, slug,
    productPdfs[]{
      title,
      sourceUrl,
      file {
        asset -> {
          _id,
          url
        }
      }
    }
  }`

  const data = await client.fetch(query)
  console.log('Sanity query result for riva-3rsl on ProductPage:')
  console.log(JSON.stringify(data, null, 2))
}

checkLocalPage().catch(console.error)
