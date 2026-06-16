import {
  MongoClient,
  type Collection,
  type Db,
  type OptionalUnlessRequiredId,
} from "mongodb";
import type { Category, Dish, Order } from "@/components/admin/mock-data";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "nomnom-admin";

let clientPromise: Promise<MongoClient> | null = null;

function getClient() {
  if (!uri) return null;

  clientPromise ??= new MongoClient(uri).connect();
  return clientPromise;
}

export async function getDb(): Promise<Db | null> {
  const client = await getClient();
  return client?.db(dbName) ?? null;
}

export async function pingDb() {
  const db = await getDb();
  if (!db) return false;

  await db.command({ ping: 1 });
  return true;
}

export async function getCollections() {
  const db = await getDb();
  if (!db) return null;

  return {
    categories: db.collection<Category>("categories"),
    dishes: db.collection<Dish>("dishes"),
    orders: db.collection<Order>("orders"),
  };
}

export async function seedCollection<T extends { id: string }>(
  collection: Collection<T>,
  seedData: T[],
) {
  const count = await collection.estimatedDocumentCount();
  if (count > 0) return;

  await collection.insertMany(seedData as OptionalUnlessRequiredId<T>[]);
}
