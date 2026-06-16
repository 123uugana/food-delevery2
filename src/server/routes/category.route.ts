import { Hono } from "hono";
import { getCategoriesController } from "@/server/controllers/category.controller";

export const categoryRoute = new Hono().get("/categories", getCategoriesController);
