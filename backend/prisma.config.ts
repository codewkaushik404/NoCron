import "./src/config/loadEnv.js";
import { defineConfig, env as prismaEnv } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  engine: "classic",
  datasource: {
    url: prismaEnv("DATABASE_URL"),
  },
});
