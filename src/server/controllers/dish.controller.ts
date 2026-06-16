import type { Context } from "hono";
import { getDishes } from "@/server/models/dish.model";

export async function getDishesController(c: Context) {
  return c.json({ dishes: await getDishes() });
}
