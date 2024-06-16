import {
  jsonb,
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

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  gender: text("gender"),
  title: text("title").notNull(),
  department: text("department").notNull(),
  industries: jsonb("industries").$type<string[]>().default([]),
  skills: jsonb("skills").$type<string[]>().default([])
})

export type DrizzleStaff = typeof staff.$inferSelect
