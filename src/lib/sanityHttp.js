const PROJECT_ID = 'xm9au2qy'
const DATASET = 'production'
const API_VERSION = '2023-08-01'

export async function fetchSanityResult(query, params = {}) {
  const baseUrl = import.meta.env.DEV
    ? `/sanity-api/v${API_VERSION}/data/query/${DATASET}`
    : `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`

  const url = new URL(baseUrl, window.location.origin)
  url.searchParams.set('query', query)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  })

  const response = await fetch(url)
  const payload = await response.json()

  if (!response.ok || payload.error) {
    throw new Error(payload.error?.description || payload.error?.message || 'Sanity request failed')
  }

  return payload.result
}
