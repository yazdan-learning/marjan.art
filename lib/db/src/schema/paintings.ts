import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod/v4";
import { seriesTable } from "./series";

export const paintingsTable = pgTable("paintings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  medium: text("medium").notNull(),
  size: text("size").notNull(),
  price: integer("price").notNull(),
  available: boolean("available").notNull().default(true),
  imageUrl: text("image_url"),
  description: text("description").notNull(),
  seriesId: integer("series_id").references(() => seriesTable.id, { onDelete: "set null" }),
  featured: boolean("featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paintingsRelations = relations(paintingsTable, ({ one }) => ({
  series: one(seriesTable, { fields: [paintingsTable.seriesId], references: [seriesTable.id] }),
}));

export const seriesRelations = relations(seriesTable, ({ many }) => ({
  paintings: many(paintingsTable),
}));

export const insertPaintingSchema = createInsertSchema(paintingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPaintingSchema = createSelectSchema(paintingsTable);
export type InsertPainting = z.infer<typeof insertPaintingSchema>;
export type PaintingRecord = typeof paintingsTable.$inferSelect;
