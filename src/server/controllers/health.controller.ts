import type { Context } from "hono";
import { pingDb } from "@/server/db";

export async function getHealth(c: Context) {
  return c.json({
    ok: true,
    service: "nomnom-hono-api",
    database: {
      configured: Boolean(process.env.MONGODB_URI),
      connected: await pingDb().catch(() => false),
    },
  });
}
