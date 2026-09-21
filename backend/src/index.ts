import express from "express";
import cors from "cors";
import "dotenv/config";

import deployRouter from "./routes/deploy.js";
import hooksRouter from "./routes/hooks.js";
import tallyRouter from "./routes/tally.js";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is healthy");
});

app.use("/deploy", deployRouter);
app.use("/hooks", hooksRouter);
app.use("/tally", tallyRouter);

app.listen(PORT, () => {
    console.log(`Server is running\nhttp://localhost:${PORT}`);
});