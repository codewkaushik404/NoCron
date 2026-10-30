import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});

const environment = (process.env.ENVIRONMENT ?? "").toLowerCase();
const isProduction = environment === "prod" || environment === "production";

if(!process.env.PORT) throw new Error("PORT is not set in env variables");
if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set in env variables");
if(!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set in env variables");
if(!process.env.ENVIRONMENT) throw new Error("ENVIRONMENT is not set in env variables");
if(!process.env.CLIENT_ID) throw new Error("CLIENT_ID is not set in env variables")
if(!process.env.CLIENT_SECRET) throw new Error("CLIENT_SECRET is not set in env variables");
if(!process.env.CALLBACK_URL) throw new Error("CALLBACK_URL is not set in env variables");
if(!process.env.SWEEPER_PORT) throw new Error("SWEEPER_PORT is not set in env variables");

if(!process.env.REDIS_URL) throw new Error("REDIS_URL is not set in env variables");
if(!process.env.REDIS_HOST) throw new Error("REDIS_HOST is not set in env variables");
if(!process.env.REDIS_PORT) throw new Error("REDIS_PORT is not set in env variables");

if(!process.env.WORKER_PORT) throw new Error("WORKER_PORT is not set in env variables");
if(!process.env.QUEUE_NAME) throw new Error("QUEUE_NAME is not set in env variables");

if(!process.env.SMTP_HOST) throw new Error("SMTP_HOST is not set in env variables");
if(!process.env.SMTP_PORT) throw new Error("SMTP_PORT is not set in env variables");
if(!process.env.SMTP_SECURE) throw new Error("SMTP_SECURE is not set in env variables");
if(!process.env.SMTP_USER) throw new Error("SMTP_USER is not set in env variables");
if(!process.env.SMTP_PASSWORD) throw new Error("SMTP_PASSWORD is not set in env variables");

if(!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is not set in env variables");

const config = {
    PORT: process.env.PORT,
    SWEEPER_PORT: process.env.SWEEPER_PORT,
    WORKER_PORT: process.env.WORKER_PORT,

    DATABASE_URL: process.env.DATABASE_URL,

    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    SESSION_SECRET: process.env.SESSION_SECRET,
    ENVIRONMENT: process.env.ENVIRONMENT,
    IS_PROD: isProduction,

    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL,

    QUEUE_NAME: process.env.QUEUE_NAME,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,

    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,

    FRONTEND_URL: process.env.FRONTEND_URL.replace(/\/+$/, "")
}

export default config;
