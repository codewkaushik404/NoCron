import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./config.js";

const adapter = new PrismaPg({
  connectionString: config.DATABASE_URL,
});

const url = new URL(config.DATABASE_URL);

console.log("DATABASE CONNECTION:", {
  host: url.hostname,
  port: url.port,
  passwordLength: decodeURIComponent(url.password),
  username: url.username,
  database: url.pathname,
});

const prisma = new PrismaClient({
  adapter
});

export default prisma;