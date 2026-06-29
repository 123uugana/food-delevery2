import { Hono } from "hono";
import { uploadImageController } from "../controllers/upload.controller.js";

export const uploadRoute = new Hono().post("/upload", uploadImageController);
