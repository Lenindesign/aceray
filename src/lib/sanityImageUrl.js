import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '@/sanityClient';

export const urlFor = (source) => createImageUrlBuilder(client).image(source);

export function optimizeSanityUrl(url, { width = 480, quality = 75 } = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('cdn.sanity.io')) return url

  const [baseUrl, queryStr] = url.split('?')
  const params = new URLSearchParams(queryStr || '')
  if (width && !params.has('w')) params.set('w', width)
  if (!params.has('auto')) params.set('auto', 'format')
  if (quality && !params.has('q')) params.set('q', quality)

  return `${baseUrl}?${params.toString()}`
}
