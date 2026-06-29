import { Hono } from "hono";
import {
  createOrderController,
  getOrdersController,
  updateManyOrderStatesController,
  updateOrderStateController,
} from "../controllers/order.controller.js";

export const orderRoute = new Hono()
  .get("/orders", getOrdersController)
  .post("/orders", createOrderController)
  .patch("/orders/bulk", updateManyOrderStatesController)
  .patch("/orders/:id", updateOrderStateController);
