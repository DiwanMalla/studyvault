import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return new PrismaPg(pool);
  },
});
