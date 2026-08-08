import { createClient } from "@sanity/client";
import fetch from "node-fetch";

const client = createClient({
  projectId: "xm9au2qy",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const CONCURRENCY = 1;

async function uploadFromUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const filename = url.split("/").pop().split("?")[0];
  return client.assets.upload("image", Buffer.from(buffer), { filename });
}

async function processInBatches(items, batchSize, fn) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(fn));
    console.log(`  ✓ Processed ${Math.min(i + batchSize, items.length)} / ${items.length}`);
  }
}

async function run() {
  console.log("Fetching products...");
  const products = await client.fetch(
    `*[_type == "product" && defined(imageUrl) && !defined(mainImage.asset)]{
      _id, title, imageUrl, galleryUrls
    }`
  );
  console.log(`Found ${products.length} products to process.\n`);

  await processInBatches(products, CONCURRENCY, async (product) => {
    try {
      const asset = await uploadFromUrl(product.imageUrl);
      const patch = client.patch(product._id).set({
        mainImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      });

      if (product.galleryUrls?.length) {
        const galleryAssets = await Promise.all(
          product.galleryUrls.map((url) => uploadFromUrl(url).catch(() => null))
        );
        const galleryItems = galleryAssets
          .filter(Boolean)
          .map((a) => ({
            _type: "image",
            _key: a._id,
            asset: { _type: "reference", _ref: a._id },
          }));
        if (galleryItems.length) patch.set({ gallery: galleryItems });
      }

      await patch.commit();
      console.log(`  ✓ ${product.title}`);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`  ✗ ${product.title}: ${err.message}`);
    }
  });

  console.log("\nDone!");
}

run().catch(console.error);
