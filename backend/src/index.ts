import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import passport from "./config/passport.js";
import config from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import hookRoutes from "./routes/hook.routes.js";
import triggerRoutes from "./routes/trigger.routes.js";
import actionRoutes from "./routes/action.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import cors from "cors";

import globalErrorHandler from "./utils/globalErrorHandler.js";

const app = express();
const PORT = config.PORT;

const pool = new Pool({
    connectionString: config.DATABASE_URL
});

const pgSessionStore = connectPgSimple(session);

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))

app.use(session({
    store: new pgSessionStore({ pool, createTableIfMissing: true}),
    resave: false,
    saveUninitialized: false,
    secret: config.SESSION_SECRET,
    name: "sid",
    cookie: {
        maxAge: 30*60*1000, //30min in ms
        httpOnly: true,
        sameSite: "strict",
        secure: config.ENVIRONMENT === "prod" ? true : false
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

app.listen(PORT, () => {
    console.log(`Server is listening on :${PORT}`);
})