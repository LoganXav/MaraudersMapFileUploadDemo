import "@/lib/drizzle/envConfig"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/lib/drizzle/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!
  }
})
