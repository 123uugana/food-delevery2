import { Hono } from "hono";
import { getHealth } from "../controllers/health.controller.js";

export const healthRoute = new Hono().get("/health", getHealth);
