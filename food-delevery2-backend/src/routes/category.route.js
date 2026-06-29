import { Hono } from "hono";
import {
  deleteCategoryController,
  getCategoriesController,
} from "../controllers/category.controller.js";

export const categoryRoute = new Hono()
  .get("/categories", getCategoriesController)
  .delete("/categories/:id", deleteCategoryController);
