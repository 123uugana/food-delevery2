import { Hono } from "hono";
import { cors } from "hono/cors";
import { categoryRoute } from "./routes/category.route.js";
import { dishRoute } from "./routes/dish.route.js";
import { healthRoute } from "./routes/health.route.js";
import { orderRoute } from "./routes/order.route.js";
import { uploadRoute } from "./routes/upload.route.js";

export const app = new Hono()
  .use(
    "/api/*",
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
      ],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    }),
  )
  .basePath("/api")
  .route("/", healthRoute)
  .route("/", categoryRoute)
  .route("/", dishRoute)
  .route("/", orderRoute)
  .route("/", uploadRoute);
