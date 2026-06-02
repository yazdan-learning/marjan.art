import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";
import { db, paintingsTable } from "@workspace/db";
import {
  ListPaintingsQueryParams,
  CreatePaintingBody,
  UpdatePaintingBody,
  GetPaintingResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";

const router: IRouter = Router();

router.get("/paintings", async (req: Request, res: Response): Promise<void> => {
  const queryParsed = ListPaintingsQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: queryParsed.error.message });
    return;
  }

  const { medium, seriesId } = queryParsed.data;
  const conditions = [];
  if (medium) conditions.push(eq(paintingsTable.medium, medium));
  if (seriesId) conditions.push(eq(paintingsTable.seriesId, seriesId));

  const rows = await db
    .select()
    .from(paintingsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(paintingsTable.displayOrder);

  res.json(rows.map((row) => GetPaintingResponse.parse(row)));
});

router.post("/paintings", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreatePaintingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(paintingsTable).values(parsed.data).returning();
  res.status(201).json(GetPaintingResponse.parse(row));
});

router.get("/paintings/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [row] = await db
    .select()
    .from(paintingsTable)
    .where(eq(paintingsTable.id, id))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Painting not found" });
    return;
  }

  res.json(GetPaintingResponse.parse(row));
});

router.patch("/paintings/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const parsed = UpdatePaintingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(paintingsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(paintingsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Painting not found" });
    return;
  }

  res.json(GetPaintingResponse.parse(row));
});

router.delete("/paintings/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [row] = await db
    .delete(paintingsTable)
    .where(eq(paintingsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Painting not found" });
    return;
  }

  res.status(204).json();
});

export default router;
