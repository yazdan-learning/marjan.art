import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateAboutSettingsBody } from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";

const router: IRouter = Router();

async function getSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  return row?.value ?? null;
}

async function setSetting(key: string, value: string | null): Promise<void> {
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  if (existing.length > 0) {
    await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key));
  } else {
    await db.insert(siteSettingsTable).values({ key, value });
  }
}

router.get("/settings/about", async (_req: Request, res: Response): Promise<void> => {
  const [bioText, imageUrl] = await Promise.all([
    getSetting("about_bio_text"),
    getSetting("about_image_url"),
  ]);
  res.json({ bioText, imageUrl });
});

router.put("/settings/about", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = UpdateAboutSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { bioText, imageUrl } = parsed.data;
  await Promise.all([
    bioText !== undefined ? setSetting("about_bio_text", bioText) : Promise.resolve(),
    imageUrl !== undefined ? setSetting("about_image_url", imageUrl ?? null) : Promise.resolve(),
  ]);

  const [updatedBio, updatedImage] = await Promise.all([
    getSetting("about_bio_text"),
    getSetting("about_image_url"),
  ]);
  res.json({ bioText: updatedBio, imageUrl: updatedImage });
});

export default router;
