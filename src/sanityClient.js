import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'xm9au2qy',
  dataset: 'production',
  apiVersion: '2023-08-01',
  useCdn: true,
});

export function sanityFetch(query, params = {}) {
  return client.fetch(query, params);
}

export default client;
