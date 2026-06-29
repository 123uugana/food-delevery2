import mongoose from "mongoose";
import { orders as seedOrders } from "../data/mock-data.js";
import { connectDb, seedModel } from "../lib/db.js";

const { model, models, Schema } = mongoose;

let fallbackOrders = seedOrders.map((order) => ({ ...order }));

const orderFoodSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    number: { type: Number, required: true, min: 1 },
    customer: { type: String, required: true, trim: true },
    foods: { type: [orderFoodSchema], required: true, default: [] },
    date: { type: String, required: true, trim: true },
    total: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    state: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled"],
      required: true,
      default: "Pending",
    },
  },
  {
    collection: "orders",
    versionKey: false,
  },
);

export const OrderModel = models.Order || model("Order", orderSchema);

export async function getOrders() {
  const connected = await connectDb();
  if (!connected) return fallbackOrders;

  await seedModel(OrderModel, seedOrders);
  return OrderModel.find({}, { _id: 0 }).sort({ number: -1 }).lean();
}

export async function createOrder(orderInput) {
  const connected = await connectDb();
  const nextNumber =
    Math.max(0, ...fallbackOrders.map((order) => Number(order.number) || 0)) + 1;
  const order = {
    id: `order-${Date.now()}`,
    number: nextNumber,
    customer: orderInput.customer,
    foods: orderInput.foods,
    date: orderInput.date,
    total: orderInput.total,
    address: orderInput.address,
    state: "Pending",
  };

  if (!connected) {
    fallbackOrders = [order, ...fallbackOrders];
    return order;
  }

  await seedModel(OrderModel, seedOrders);
  const lastOrder = await OrderModel.findOne({}, { number: 1, _id: 0 })
    .sort({ number: -1 })
    .lean();
  const created = await OrderModel.create({
    ...order,
    number: (Number(lastOrder?.number) || 0) + 1,
  });

  return created.toObject({ versionKey: false, transform: (_, ret) => {
    delete ret._id;
    return ret;
  } });
}

export async function updateOrderState(id, state) {
  const connected = await connectDb();
  if (!connected) {
    const order = fallbackOrders.find((item) => item.id === id);
    if (!order) return null;

    fallbackOrders = fallbackOrders.map((item) =>
      item.id === id ? { ...item, state } : item,
    );
    return { ...order, state };
  }

  await seedModel(OrderModel, seedOrders);
  return OrderModel.findOneAndUpdate(
    { id },
    { $set: { state } },
    { new: true, projection: { _id: 0 } },
  ).lean();
}

export async function updateManyOrderStates(ids, state) {
  const connected = await connectDb();
  if (!connected) {
    const selectedIds = new Set(ids);
    fallbackOrders = fallbackOrders.map((order) =>
      selectedIds.has(order.id) ? { ...order, state } : order,
    );
    return fallbackOrders;
  }

  await seedModel(OrderModel, seedOrders);
  await OrderModel.updateMany({ id: { $in: ids } }, { $set: { state } });
  return OrderModel.find({}, { _id: 0 }).lean();
}
