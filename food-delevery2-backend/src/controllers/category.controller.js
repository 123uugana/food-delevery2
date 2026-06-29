import { deleteCategory, getCategories } from "../models/category.model.js";

export async function getCategoriesController(c) {
  return c.json({ categories: await getCategories() });
}

export async function deleteCategoryController(c) {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Category id is required." }, 400);

  const category = await deleteCategory(id);
  if (!category) return c.json({ error: "Category not found." }, 404);

  return c.json({ category });
}
