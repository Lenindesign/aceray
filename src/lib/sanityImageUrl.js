import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '@/sanityClient';

export const urlFor = (source) => createImageUrlBuilder(client).image(source);

export function optimizeSanityUrl(url, { width = 480, quality = 75 } = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('cdn.sanity.io')) return url

  const baseUrl = url.split('?')[0]
  return `${baseUrl}?w=${width}&auto=format&q=${quality}`
}
