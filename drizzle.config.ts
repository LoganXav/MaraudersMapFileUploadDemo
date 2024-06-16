import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

export default {
  schema: "./src/server/neon/schema.ts",
  dialect: "postgresql",
  out: "./src/server/neon/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
} satisfies Config

// npx drizzle-kit generate
// npx drizzle-kit push
