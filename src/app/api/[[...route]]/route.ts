import { handle } from "hono/vercel";
import { api } from "../../../server";

export const runtime = "nodejs";

export const GET = handle(api);
export const PATCH = handle(api);
