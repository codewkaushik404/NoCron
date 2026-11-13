// <reference path="./types/express.d.ts" />
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import passport from "../../config/passport.js";
import config from "../../config/config.js";
import authRoutes from "../../routes/auth.routes.js";
import hookRoutes from "../../routes/hook.routes.js";
import triggerRoutes from "../../routes/trigger.routes.js";
import actionRoutes from "../../routes/action.routes.js";
import workflowRoutes from "../../routes/workflow.routes.js";
import cors from "cors";

import globalErrorHandler from "../../utils/globalErrorHandler.js";

export const app = express();

//app.set("trust proxy", 1);

const pool = new Pool({
    connectionString: config.DATABASE_URL
});

const pgSessionStore = connectPgSimple(session);

app.use(cors({
    origin: [config.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
}))

app.use(session({
    store: new pgSessionStore({ pool, createTableIfMissing: true}),
    resave: false,
    saveUninitialized: false,
    secret: config.SESSION_SECRET,
    name: "sid",
    cookie: {
        maxAge: 10*60*1000, //10min in ms
        httpOnly: true,
        sameSite: "none",
        secure: true
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Server is running");
})

app.use("/api/auth", authRoutes);
app.use("/api/v1/hooks", hookRoutes);
app.use("/api/v1/triggers", triggerRoutes);
app.use("/api/v1/actions", actionRoutes);
app.use("/api/v1/workflows", workflowRoutes);

app.use(globalErrorHandler);
