import { pingDb } from "../lib/db.js";

export async function getHealth(c) {
  return c.json({
    ok: true,
    service: "nomnom-hono-api",
    database: {
      configured: Boolean(process.env.MONGODB_URI),
      connected: await pingDb().catch(() => false),
    },
  });
}
