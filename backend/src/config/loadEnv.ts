import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "node:path";

const result = dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});

dotenvExpand.expand(result);
