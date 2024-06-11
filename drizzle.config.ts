// import "@/server/drizzle/envConfig"
// import { defineConfig } from "drizzle-kit"

// export default defineConfig({
//   schema: "./src/server/vercel-postgres/schema.ts",
//   dialect: "postgresql",
//   out: "./src/server/vercel-postgres/migrations",
//   dbCredentials: {
//     url: process.env.POSTGRES_URL!
//   }
// })

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
