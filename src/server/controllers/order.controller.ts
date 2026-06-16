import type { Context } from "hono";
import type { DeliveryState } from "@/components/admin/mock-data";
import {
  getOrders,
  updateManyOrderStates,
  updateOrderState,
} from "@/server/models/order.model";

const deliveryStates: DeliveryState[] = ["Pending", "Delivered", "Cancelled"];

function isDeliveryState(value: unknown): value is DeliveryState {
  return typeof value === "string" && deliveryStates.includes(value as DeliveryState);
}

export async function getOrdersController(c: Context) {
  return c.json({ orders: await getOrders() });
}

export async function updateOrderStateController(c: Context) {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  const state = body?.state;

  if (!id) {
    return c.json({ error: "Order id is required." }, 400);
  }

  if (!isDeliveryState(state)) {
    return c.json({ error: "Invalid delivery state." }, 400);
  }

  const order = await updateOrderState(id, state);
  if (!order) {
    return c.json({ error: "Order not found." }, 404);
  }

  return c.json({ order });
}

export async function updateManyOrderStatesController(c: Context) {
  const body = await c.req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  const state = body?.state;

  if (!ids.every((id: unknown) => typeof id === "string") || !isDeliveryState(state)) {
    return c.json({ error: "Invalid order ids or delivery state." }, 400);
  }

  return c.json({ orders: await updateManyOrderStates(ids, state) });
}
