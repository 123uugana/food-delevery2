import { categories as seedCategories } from "@/components/admin/mock-data";
import { getCollections, seedCollection } from "@/server/db";

export async function getCategories() {
  const collections = await getCollections();
  if (!collections) return seedCategories;

  await seedCollection(collections.categories, seedCategories);
  return collections.categories.find({}, { projection: { _id: 0 } }).toArray();
}
