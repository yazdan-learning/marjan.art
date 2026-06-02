import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const seriesTable = pgTable("series", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeriesSchema = createInsertSchema(seriesTable).omit({ id: true, createdAt: true });
export const selectSeriesSchema = createSelectSchema(seriesTable);
export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Series = typeof seriesTable.$inferSelect;
