import { dishes as seedDishes } from "@/components/admin/mock-data";
import { getCollections, seedCollection } from "@/server/db";

export async function getDishes() {
  const collections = await getCollections();
  if (!collections) return seedDishes;

  await seedCollection(collections.dishes, seedDishes);
  return collections.dishes.find({}, { projection: { _id: 0 } }).toArray();
}
