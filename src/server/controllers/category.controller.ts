import type { Context } from "hono";
import { getCategories } from "@/server/models/category.model";

export async function getCategoriesController(c: Context) {
  return c.json({ categories: await getCategories() });
}
