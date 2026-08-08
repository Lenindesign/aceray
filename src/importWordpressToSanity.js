#!/usr/bin/env node
/**
 * importWordpressToSanity.js
 *
 * Parses the WordPress WXR export XML and produces a Sanity-compatible
 * NDJSON file that can be imported with:
 *
 *   npx sanity dataset import sanity-products.ndjson production --replace
 *
 * Usage:
 *   node src/importWordpressToSanity.js [path-to-xml]
 *
 * If no path is given it defaults to the file in the project root.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { DOMParser } from '@xmldom/xmldom';

// ── Paths ──────────────────────────────────────────────────
const xmlPath = process.argv[2]
  || resolve('aceraycustomhospitalityseating.WordPress.2026-08-01.xml');

const outPath = resolve('sanity-products.ndjson');

console.log(`📄 Reading XML: ${xmlPath}`);
const xml = readFileSync(xmlPath, 'utf8');

// ── Parse XML ──────────────────────────────────────────────
const doc = new DOMParser().parseFromString(xml, 'text/xml');
const items = doc.getElementsByTagName('item');

// ── Build attachment ID → URL lookup ───────────────────────
const attachments = {};
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const postType = getText(item, 'wp:post_type');
  if (postType !== 'attachment') continue;
  const pid = getText(item, 'wp:post_id');
  const urlNode = item.getElementsByTagNameNS('http://wordpress.org/export/1.2/', 'attachment_url')[0];
  if (urlNode) {
    attachments[pid] = urlNode.textContent.trim();
  }
}
console.log(`🖼  Found ${Object.keys(attachments).length} media attachments`);

// ── Process products ───────────────────────────────────────
const products = [];
let skipped = 0;
const publishedProductIds = new Set();

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const postType = getText(item, 'wp:post_type');
  const status = getText(item, 'wp:status');

  if (postType === 'product' && status === 'publish') {
    publishedProductIds.add(getText(item, 'wp:post_id'));
  }
}

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const postType = getText(item, 'wp:post_type');
  const status   = getText(item, 'wp:status');

  if (postType !== 'product' || status !== 'publish') continue;

  const title    = getText(item, 'title')     || 'Untitled';
  const postName = getText(item, 'wp:post_name') || title.toLowerCase().replace(/\s+/g, '-');
  const postId   = getText(item, 'wp:post_id');
  const content  = getCData(item, 'content:encoded') || '';

  // ── Categories & tags ───────────────────────────────────
  const cats = [];
  const tags = [];
  const catNodes = item.getElementsByTagName('category');
  for (let c = 0; c < catNodes.length; c++) {
    const domain   = catNodes[c].getAttribute('domain');
    const nicename = catNodes[c].getAttribute('nicename');
    const name     = catNodes[c].textContent.trim();
    if (domain === 'product_cat')  cats.push(name);
    if (domain === 'product_tag')  tags.push(name);
  }

  // ── Post meta (ACF / WooCommerce custom fields) ─────────
  const meta = getPostMeta(item);
  const fromThisCollectionIds = parseSerializedPostIds(meta['from_this_collection'])
    .filter(id => publishedProductIds.has(id) && id !== postId);
  const youMayAlsoLikeIds = parseSerializedPostIds(meta['you_may_also_like'])
    .filter(id => publishedProductIds.has(id) && id !== postId);

  // ── Featured image ──────────────────────────────────────
  const thumbnailId = meta['_thumbnail_id'];
  const imageUrl = thumbnailId ? (attachments[thumbnailId] || '') : '';

  // ── Gallery images ──────────────────────────────────────
  const galleryIds = (meta['_product_image_gallery'] || '').split(',').filter(Boolean);
  const galleryUrls = galleryIds
    .map(id => attachments[id.trim()])
    .filter(Boolean);

  // ── Clean description (strip shortcodes) ────────────────
  const description = content
    .replace(/\[.*?\]/g, '')   // strip [shortcodes]
    .replace(/<[^>]+>/g, '')   // strip HTML tags
    .trim();

  // ── Build Sanity document ───────────────────────────────
  const doc = {
    _type: 'product',
    _id: `wp-product-${postId}`,     // deterministic ID for idempotent imports
    title,
    slug: { _type: 'slug', current: postName },
    designer:      meta['designer']       || '',
    madeIn:        meta['made_in']        || '',
    categories:    cats.length ? cats : undefined,
    tags:          tags.length ? tags : undefined,
    imageUrl:      imageUrl               || undefined,
    galleryUrls:   galleryUrls.length ? galleryUrls : undefined,
    description:   description            || undefined,
    overallHeight: meta['overall_height'] || undefined,
    overallWidth:  meta['overall_width']  || undefined,
    overallDepth:  meta['overall_depth']  || undefined,
    seatHeight:    meta['seat_height']    || undefined,
    weight:        meta['weight']         || undefined,
    com:           meta['com']            || undefined,
    stacking:      meta['stacking']       || undefined,
    isNewArrival:  false,
    wpPostId:      parseInt(postId, 10),
    legacyRelatedProductIds: (fromThisCollectionIds.length || youMayAlsoLikeIds.length)
      ? {
          fromThisCollection: fromThisCollectionIds.length ? fromThisCollectionIds : undefined,
          youMayAlsoLike: youMayAlsoLikeIds.length ? youMayAlsoLikeIds : undefined,
        }
      : undefined,
    fromThisCollection: fromThisCollectionIds.length
      ? fromThisCollectionIds.map(id => ({
          _key: `from-${id}`,
          _type: 'reference',
          _ref: `wp-product-${id}`,
        }))
      : undefined,
    youMayAlsoLike: youMayAlsoLikeIds.length
      ? youMayAlsoLikeIds.map(id => ({
          _key: `like-${id}`,
          _type: 'reference',
          _ref: `wp-product-${id}`,
        }))
      : undefined,
  };

  // Remove undefined keys (Sanity import doesn't like them)
  for (const key of Object.keys(doc)) {
    if (doc[key] === undefined) delete doc[key];
  }

  products.push(doc);
}

console.log(`✅ Processed ${products.length} published products (skipped ${skipped} drafts/trash)`);

// ── Write NDJSON ───────────────────────────────────────────
const ndjson = products.map(p => JSON.stringify(p)).join('\n');
writeFileSync(outPath, ndjson, 'utf8');
console.log(`📦 Written to ${outPath}`);
console.log(`\nNext step:\n  npx sanity dataset import ${outPath} production --replace\n`);

// ── Helpers ────────────────────────────────────────────────
function getText(parent, tagName) {
  // Handle namespaced tags like wp:post_type
  const parts = tagName.split(':');
  let nodes;
  if (parts.length === 2) {
    const nsMap = {
      'wp': 'http://wordpress.org/export/1.2/',
      'dc': 'http://purl.org/dc/elements/1.1/',
      'content': 'http://purl.org/rss/1.0/modules/content/',
      'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    };
    nodes = parent.getElementsByTagNameNS(nsMap[parts[0]] || '', parts[1]);
  } else {
    nodes = parent.getElementsByTagName(tagName);
  }
  if (!nodes || nodes.length === 0) return '';
  return (nodes[0].textContent || '').trim();
}

function getCData(parent, tagName) {
  const parts = tagName.split(':');
  const nsMap = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
  };
  const nodes = parent.getElementsByTagNameNS(nsMap[parts[0]] || '', parts[1]);
  if (!nodes || nodes.length === 0) return '';
  return (nodes[0].textContent || '').trim();
}

function getPostMeta(item) {
  const nsWP = 'http://wordpress.org/export/1.2/';
  const metaNodes = item.getElementsByTagNameNS(nsWP, 'postmeta');
  const result = {};
  for (let i = 0; i < metaNodes.length; i++) {
    const keyNode = metaNodes[i].getElementsByTagNameNS(nsWP, 'meta_key')[0];
    const valNode = metaNodes[i].getElementsByTagNameNS(nsWP, 'meta_value')[0];
    if (keyNode && valNode) {
      const key = (keyNode.textContent || '').trim();
      const val = (valNode.textContent || '').trim();
      if (val) result[key] = val;
    }
  }
  return result;
}

function parseSerializedPostIds(value = '') {
  return Array.from(String(value).matchAll(/s:\d+:"(\d+)"/g), match => match[1]);
}
