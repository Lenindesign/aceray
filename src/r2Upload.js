// src/r2Upload.js
/**
 * Simple helper to upload an image file to Cloudflare R2.
 * It uses the public API token defined in the Vite environment variables.
 * The function returns the public URL of the uploaded object.
 */
export async function uploadImage(file) {
  const token = import.meta.env.VITE_R2_API_TOKEN;
  const bucketUrl = import.meta.env.VITE_R2_PUBLIC_URL; // e.g. https://<account-id>.r2.cloudflarestorage.com/images/

  if (!token || !bucketUrl) {
    throw new Error('R2 credentials are not set in environment variables');
  }

  // Cloudflare R2 expects a PUT request to the object URL.
  const objectUrl = `${bucketUrl}${encodeURIComponent(file.name)}`;

  const response = await fetch(objectUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`R2 upload failed: ${response.status}`);
  }

  // The public URL is the same as the object URL.
  return objectUrl;
}
