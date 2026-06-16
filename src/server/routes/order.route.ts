import { Hono } from "hono";
import {
  getOrdersController,
  updateManyOrderStatesController,
  updateOrderStateController,
} from "@/server/controllers/order.controller";

export const orderRoute = new Hono()
  .get("/orders", getOrdersController)
  .patch("/orders/bulk", updateManyOrderStatesController)
  .patch("/orders/:id", updateOrderStateController);
