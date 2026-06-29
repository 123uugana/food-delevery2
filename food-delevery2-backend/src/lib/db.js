import mongoose from "mongoose";
import "./env.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "nomnom-admin";

let connectionPromise = null;

export async function connectDb() {
  if (!uri) return null;
  if (mongoose.connection.readyState === 1) return mongoose;

  connectionPromise ??= mongoose.connect(uri, { dbName });
  return connectionPromise;
}

export async function pingDb() {
  const connection = await connectDb();
  if (!connection?.connection.db) return false;

  await connection.connection.db.admin().ping();
  return true;
}

export async function seedModel(model, seedData) {
  const connected = await connectDb();
  if (!connected) return;

  const count = await model.estimatedDocumentCount();
  if (count > 0) return;

  await model.insertMany(seedData, { ordered: false });
}
