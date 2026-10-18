import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import deployRouter from "./routes/deploy.js";
import hooksRouter from "./routes/hooks.js";
import tallyRouter from "./routes/tally.js";
import authRouter from "./routes/auth.js";

const app = express();

const PORT = process.env.PORT || 8000;

// credentials: true + a specific origin is required for the session cookie
// to be sent cross-origin; cors() with no options (the old config) sends
// Access-Control-Allow-Origin: * , which browsers refuse to pair with cookies.
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is healthy");
});

app.use("/auth", authRouter);
app.use("/deploy", deployRouter);
app.use("/hooks", hooksRouter);
app.use("/tally", tallyRouter);

app.listen(PORT, () => {
    console.log(`Server is running\nhttp://localhost:${PORT}`);
});