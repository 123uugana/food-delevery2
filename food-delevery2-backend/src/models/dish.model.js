import mongoose from "mongoose";
import { dishes as seedDishes } from "../data/mock-data.js";
import { connectDb, seedModel } from "../lib/db.js";
import { CategoryModel } from "./category.model.js";

const { model, models, Schema } = mongoose;

let fallbackDishes = seedDishes.map((dish) => ({ ...dish }));

const dishSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    categoryId: {
      type: String,
      required: true,
      ref: "Category",
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    ingredients: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  {
    collection: "dishes",
    versionKey: false,
  },
);

export const DishModel = models.Dish || model("Dish", dishSchema);

export async function getDishes() {
  const connected = await connectDb();
  if (!connected) return fallbackDishes;

  await seedModel(DishModel, seedDishes);
  return DishModel.find({}, { _id: 0 }).lean();
}

export async function createDish(input) {
  const dish = {
    id: input.id || `dish-${Date.now()}`,
    categoryId: input.categoryId,
    name: input.name,
    ingredients: input.ingredients,
    price: input.price,
    image: input.image,
  };

  const connected = await connectDb();
  if (!connected) {
    fallbackDishes = [dish, ...fallbackDishes];
    return dish;
  }

  await seedModel(DishModel, seedDishes);
  await DishModel.create(dish);
  await CategoryModel.updateOne({ id: dish.categoryId }, { $inc: { count: 1 } });

  return dish;
}

export async function updateDish(id, input) {
  const connected = await connectDb();
  if (!connected) {
    let updatedDish = null;
    fallbackDishes = fallbackDishes.map((dish) => {
      if (dish.id !== id) return dish;

      updatedDish = { ...dish, ...input, id };
      return updatedDish;
    });
    return updatedDish;
  }

  await seedModel(DishModel, seedDishes);
  const existingDish = await DishModel.findOne({ id }, { _id: 0 }).lean();
  if (!existingDish) return null;

  const updatedDish = await DishModel.findOneAndUpdate(
    { id },
    { $set: input },
    { new: true, projection: { _id: 0 } },
  ).lean();

  if (input.categoryId && input.categoryId !== existingDish.categoryId) {
    await Promise.all([
      CategoryModel.updateOne({ id: existingDish.categoryId }, { $inc: { count: -1 } }),
      CategoryModel.updateOne({ id: input.categoryId }, { $inc: { count: 1 } }),
    ]);
  }

  return updatedDish;
}

export async function deleteDish(id) {
  const connected = await connectDb();
  if (!connected) {
    const dish = fallbackDishes.find((item) => item.id === id);
    fallbackDishes = fallbackDishes.filter((item) => item.id !== id);
    return dish ?? null;
  }

  await seedModel(DishModel, seedDishes);
  const dish = await DishModel.findOne({ id }, { _id: 0 }).lean();
  if (!dish) return null;

  await DishModel.deleteOne({ id });
  await CategoryModel.updateOne({ id: dish.categoryId }, { $inc: { count: -1 } });

  return dish;
}

export async function deleteDishesByCategoryId(categoryId) {
  const connected = await connectDb();
  if (!connected) {
    fallbackDishes = fallbackDishes.filter((dish) => dish.categoryId !== categoryId);
    return;
  }

  await seedModel(DishModel, seedDishes);
  await DishModel.deleteMany({ categoryId });
}
