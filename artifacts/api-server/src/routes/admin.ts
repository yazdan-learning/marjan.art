import { Router, type IRouter, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { AdminLoginBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  logger.warn("ADMIN_PASSWORD env var is not set, falling back to 'admin123'");
}

const finalAdminPassword = ADMIN_PASSWORD ?? "admin123";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret";
const COOKIE_NAME = "admin_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/auth/admin/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password === finalAdminPassword) {
    const token = jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.json({ authenticated: true });
    return;
  }

  res.status(401).json({ error: "Invalid password" });
});

router.get("/auth/admin/me", async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.json({ authenticated: false });
    return;
  }
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch {
    res.json({ authenticated: false });
  }
});

router.post("/auth/admin/logout", async (req: Request, res: Response): Promise<void> => {
  res.clearCookie(COOKIE_NAME);
  res.json({ authenticated: false });
});

export default router;
