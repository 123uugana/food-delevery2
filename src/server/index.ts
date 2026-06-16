import { Hono } from "hono";
import { categoryRoute } from "@/server/routes/category.route";
import { dishRoute } from "@/server/routes/dish.route";
import { healthRoute } from "@/server/routes/health.route";
import { orderRoute } from "@/server/routes/order.route";

export const api = new Hono()
  .basePath("/api")
  .route("/", healthRoute)
  .route("/", categoryRoute)
  .route("/", dishRoute)
  .route("/", orderRoute);
