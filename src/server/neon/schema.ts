import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core"

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  clientName: text("client_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fileKey: text("file_key").notNull()
})

export type DrizzleClients = typeof clients.$inferSelect
