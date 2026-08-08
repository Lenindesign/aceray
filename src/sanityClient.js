import { createClient } from '@sanity/client';

const projectId = 'xm9au2qy';
const dataset = 'production';
const apiVersion = '2023-08-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export async function sanityFetch(query, params = {}) {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const url = new URL(`/sanity-api/v${apiVersion}/data/query/${dataset}`, window.location.origin);
    url.searchParams.set('query', query);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    });

    const response = await fetch(url);
    const payload = await response.json();

    if (!response.ok || payload.error) {
      throw new Error(payload.error?.description || payload.error?.message || 'Sanity request failed');
    }

    return payload.result;
  }

  return client.fetch(query, params);
}

export default client;
