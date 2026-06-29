import mongoose from "mongoose";
import { categories as seedCategories } from "../data/mock-data.js";
import { connectDb, seedModel } from "../lib/db.js";

const { model, models, Schema } = mongoose;

let fallbackCategories = seedCategories.map((category) => ({ ...category }));

const categorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    collection: "categories",
    versionKey: false,
  },
);

export const CategoryModel =
  models.Category || model("Category", categorySchema);

export async function getCategories() {
  const connected = await connectDb();
  if (!connected) return fallbackCategories;

  await seedModel(CategoryModel, seedCategories);
  return CategoryModel.find({}, { _id: 0 }).lean();
}

export async function deleteCategory(id) {
  if (id === "all") return null;

  const connected = await connectDb();
  if (!connected) {
    const category = fallbackCategories.find((item) => item.id === id);
    fallbackCategories = fallbackCategories.filter((item) => item.id !== id);
    const { deleteDishesByCategoryId } = await import("./dish.model.js");
    await deleteDishesByCategoryId(id);
    return category ?? null;
  }

  await seedModel(CategoryModel, seedCategories);
  const category = await CategoryModel.findOne({ id }, { _id: 0 }).lean();
  if (!category) return null;

  await CategoryModel.deleteOne({ id });
  const { deleteDishesByCategoryId } = await import("./dish.model.js");
  await deleteDishesByCategoryId(id);

  return category;
}
