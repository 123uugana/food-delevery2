import { Hono } from "hono";
import { getHealth } from "@/server/controllers/health.controller";

export const healthRoute = new Hono().get("/health", getHealth);
