import { Hono } from "hono";
import { getDishesController } from "@/server/controllers/dish.controller";

export const dishRoute = new Hono().get("/dishes", getDishesController);
