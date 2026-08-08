import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from '@/sanityClient';

export const urlFor = (source) => createImageUrlBuilder(client).image(source);
