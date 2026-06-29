import {
  createOrder,
  getOrders,
  updateManyOrderStates,
  updateOrderState,
} from "../models/order.model.js";

const deliveryStates = ["Pending", "Delivered", "Cancelled"];

function isDeliveryState(value) {
  return typeof value === "string" && deliveryStates.includes(value);
}

export async function getOrdersController(c) {
  return c.json({ orders: await getOrders() });
}

export async function createOrderController(c) {
  const body = await c.req.json().catch(() => null);
  const foods = Array.isArray(body?.foods) ? body.foods : [];

  if (!foods.length) {
    return c.json({ error: "Order must include foods." }, 400);
  }

  if (typeof body?.address !== "string" || !body.address.trim()) {
    return c.json({ error: "Delivery address is required." }, 400);
  }

  if (typeof body?.total !== "string" || !body.total.trim()) {
    return c.json({ error: "Order total is required." }, 400);
  }

  const orderFoods = foods.map((food) => ({
    id: String(food.id ?? ""),
    name: String(food.name ?? ""),
    image: String(food.image ?? ""),
    quantity: Math.max(1, Number(food.quantity) || 1),
  }));

  if (orderFoods.some((food) => !food.id || !food.name || !food.image)) {
    return c.json({ error: "Invalid food item." }, 400);
  }

  const order = await createOrder({
    customer: typeof body.customer === "string" && body.customer.trim()
      ? body.customer.trim()
      : "Guest customer",
    foods: orderFoods,
    date: typeof body.date === "string" && body.date.trim()
      ? body.date.trim()
      : new Date().toISOString().slice(0, 10).replaceAll("-", "/"),
    total: body.total.trim(),
    address: body.address.trim(),
  });

  return c.json({ order }, 201);
}

export async function updateOrderStateController(c) {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  const state = body?.state;

  if (!id) return c.json({ error: "Order id is required." }, 400);
  if (!isDeliveryState(state)) {
    return c.json({ error: "Invalid delivery state." }, 400);
  }

  const order = await updateOrderState(id, state);
  if (!order) return c.json({ error: "Order not found." }, 404);

  return c.json({ order });
}

export async function updateManyOrderStatesController(c) {
  const body = await c.req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  const state = body?.state;

  if (!ids.every((id) => typeof id === "string") || !isDeliveryState(state)) {
    return c.json({ error: "Invalid order ids or delivery state." }, 400);
  }

  return c.json({ orders: await updateManyOrderStates(ids, state) });
}
