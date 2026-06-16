import {
  orders as seedOrders,
  type DeliveryState,
  type Order,
} from "@/components/admin/mock-data";
import { getCollections, seedCollection } from "@/server/db";

let fallbackOrders: Order[] = seedOrders.map((order) => ({ ...order }));

export async function getOrders() {
  const collections = await getCollections();
  if (!collections) return fallbackOrders;

  await seedCollection(collections.orders, seedOrders);
  return collections.orders.find({}, { projection: { _id: 0 } }).toArray();
}

export async function updateOrderState(id: string, state: DeliveryState) {
  const collections = await getCollections();
  if (!collections) {
    const order = fallbackOrders.find((item) => item.id === id);
    if (!order) return null;

    fallbackOrders = fallbackOrders.map((item) =>
      item.id === id ? { ...item, state } : item,
    );
    return { ...order, state };
  }

  await seedCollection(collections.orders, seedOrders);
  return collections.orders.findOneAndUpdate(
    { id },
    { $set: { state } },
    { projection: { _id: 0 }, returnDocument: "after" },
  );
}

export async function updateManyOrderStates(ids: string[], state: DeliveryState) {
  const collections = await getCollections();
  if (!collections) {
    const selectedIds = new Set(ids);
    fallbackOrders = fallbackOrders.map((order) =>
      selectedIds.has(order.id) ? { ...order, state } : order,
    );
    return fallbackOrders;
  }

  await seedCollection(collections.orders, seedOrders);
  await collections.orders.updateMany({ id: { $in: ids } }, { $set: { state } });
  return collections.orders.find({}, { projection: { _id: 0 } }).toArray();
}
