import { createDish, deleteDish, getDishes, updateDish } from "../models/dish.model.js";

function normalizeDishInput(input) {
  return {
    id: input.id,
    categoryId: input.categoryId,
    name: input.name,
    ingredients: input.ingredients,
    price: input.price,
    image: input.image,
  };
}

export async function getDishesController(c) {
  return c.json({ dishes: await getDishes() });
}

export async function createDishController(c) {
  const input = normalizeDishInput(await c.req.json());

  if (!input.categoryId || !input.name || !input.ingredients || !input.price || !input.image) {
    return c.json({ error: "Dish category, name, ingredients, price, and image are required." }, 400);
  }

  return c.json({ dish: await createDish(input) }, 201);
}

export async function updateDishController(c) {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Dish id is required." }, 400);

  const dish = await updateDish(id, normalizeDishInput(await c.req.json()));
  if (!dish) return c.json({ error: "Dish not found." }, 404);

  return c.json({ dish });
}

export async function deleteDishController(c) {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Dish id is required." }, 400);

  const dish = await deleteDish(id);
  if (!dish) return c.json({ error: "Dish not found." }, 404);

  return c.json({ dish });
}
