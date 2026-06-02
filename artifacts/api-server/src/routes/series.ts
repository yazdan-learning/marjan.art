import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, seriesTable } from "@workspace/db";
import { CreateSeriesBody, UpdateSeriesBody, UpdateSeriesResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";

const router: IRouter = Router();

router.get("/series", async (req: Request, res: Response): Promise<void> => {
  const rows = await db
    .select()
    .from(seriesTable)
    .orderBy(seriesTable.name);

  res.json(rows.map((row) => UpdateSeriesResponse.parse(row)));
});

router.post("/series", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateSeriesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(seriesTable).values(parsed.data).returning();
  res.status(201).json(UpdateSeriesResponse.parse(row));
});

router.patch("/series/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const parsed = UpdateSeriesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(seriesTable)
    .set(parsed.data)
    .where(eq(seriesTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Series not found" });
    return;
  }

  res.json(UpdateSeriesResponse.parse(row));
});

router.delete("/series/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [row] = await db
    .delete(seriesTable)
    .where(eq(seriesTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Series not found" });
    return;
  }

  res.status(204).json();
});

export default router;
