import { put } from "@vercel/blob";

function filenameSafe(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function uploadImageController(c) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return c.json({ error: "BLOB_READ_WRITE_TOKEN is not configured." }, 500);
  }

  const body = await c.req.parseBody();
  const file = body.file;

  if (!(file instanceof File)) {
    return c.json({ error: "Image file is required." }, 400);
  }

  const safeName = filenameSafe(file.name || "dish-image");
  const pathname = `dish-images/${Date.now()}-${safeName}`;
  const blob = await put(pathname, file, { access: "public" });

  return c.json({ url: blob.url, pathname: blob.pathname });
}
