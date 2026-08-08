import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { DOMParser } from '@xmldom/xmldom';

const xmlPath = "/Users/leninaviles/Desktop/Desktop - Lenin’s MacBook Pro/aceraycustomhospitalityseating.WordPress.2026-08-01.xml";
const outPath = "/Users/leninaviles/.gemini/antigravity-ide/brain/2e0d92a7-1ba0-4de3-aaaf-0cb7e6bea0db/scratch/wxr_analysis.json";

console.log(`Reading XML: ${xmlPath}`);
const xml = readFileSync(xmlPath, 'utf8');

console.log("Parsing XML...");
const doc = new DOMParser().parseFromString(xml, 'text/xml');
const items = doc.getElementsByTagName('item');

console.log(`Found ${items.length} total items in WXR export. Analyzing...`);

const postTypes = {};
const postStatuses = {};
const pages = [];
const products = [];
const attachments = [];
const menus = {};
const productCategories = new Set();
const productTags = new Set();

function getText(parent, tagName) {
  const parts = tagName.split(':');
  let nodes;
  if (parts.length === 2) {
    const nsMap = {
      'wp': 'http://wordpress.org/export/1.2/',
      'dc': 'http://purl.org/dc/elements/1.1/',
      'content': 'http://purl.org/rss/1.0/modules/content/',
    };
    nodes = parent.getElementsByTagNameNS(nsMap[parts[0]] || '', parts[1]);
  } else {
    nodes = parent.getElementsByTagName(tagName);
  }
  if (!nodes || nodes.length === 0) return '';
  return (nodes[0].textContent || '').trim();
}

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const postType = getText(item, 'wp:post_type');
  const status = getText(item, 'wp:status');
  const title = getText(item, 'title') || 'Untitled';
  const slug = getText(item, 'wp:post_name') || '';

  postTypes[postType] = (postTypes[postType] || 0) + 1;
  const statusKey = `${postType}:${status}`;
  postStatuses[statusKey] = (postStatuses[statusKey] || 0) + 1;

  if (postType === 'page' && status === 'publish') {
    pages.push({ title, slug });
  } else if (postType === 'product' && status === 'publish') {
    products.push({ title, slug });
    // Categories and tags
    const catNodes = item.getElementsByTagName('category');
    for (let c = 0; c < catNodes.length; c++) {
      const domain = catNodes[c].getAttribute('domain');
      const name = catNodes[c].textContent.trim();
      if (domain === 'product_cat') productCategories.add(name);
      if (domain === 'product_tag') productTags.add(name);
    }
  } else if (postType === 'attachment') {
    attachments.push({ title, slug });
  } else if (postType === 'nav_menu_item' && status === 'publish') {
    // Menu items
    const menuNodes = item.getElementsByTagName('category');
    for (let m = 0; m < menuNodes.length; m++) {
      const domain = menuNodes[m].getAttribute('domain');
      const name = menuNodes[m].textContent.trim();
      if (domain === 'nav_menu') {
        menus[name] = (menus[name] || 0) + 1;
      }
    }
  }
}

const report = {
  summary: {
    total_wxr_items: items.length,
    published_products: products.length,
    published_pages: pages.length,
    total_attachments: attachments.length,
    published_menu_items: Object.keys(menus).reduce((sum, k) => sum + menus[k], 0),
  },
  post_types_count: postTypes,
  status_counts: postStatuses,
  published_pages_list: pages,
  menus: menus,
  product_categories: Array.from(productCategories).sort(),
  product_tags_count: productTags.size,
};

writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`Analysis complete! Output written to ${outPath}`);
