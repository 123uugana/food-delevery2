import { Hono } from "hono";
import {
  createDishController,
  deleteDishController,
  getDishesController,
  updateDishController,
} from "../controllers/dish.controller.js";

export const dishRoute = new Hono()
  .get("/dishes", getDishesController)
  .post("/dishes", createDishController)
  .patch("/dishes/:id", updateDishController)
  .delete("/dishes/:id", deleteDishController);
