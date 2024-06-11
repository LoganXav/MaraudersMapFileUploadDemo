import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core"

export const ClientTable = pgTable(
  "clients",
  {
    id: serial("id").primaryKey(),
    client_name: text("client_name").notNull(),
    file_key: text("file_key").notNull(),
    file_name: text("file_name").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull()
  },
  (clients) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(clients.client_name)
    }
  }
)
