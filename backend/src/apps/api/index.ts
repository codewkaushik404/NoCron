import { app } from "./app.js";
import config from "../../config/config.js";
import prisma from "../../config/prismaClient.js";

const server = app.listen(config.PORT, () => {
    console.log(`Server is listening on :${config.PORT}`);
})

async function shutdown(signal: string){
    console.log(`${signal} received. Shutting down...`);

    server.close(async (err) => {
        if (err) {
            console.error("Error closing HTTP server:", err);
        }

        await prisma.$disconnect();
        console.log("Backend shutdown complete");
        process.exit(err ? 1 : 0);
    });
}

//SIGINT -> signal interrupt(ctrl+c) SIGTERM -> signal terminate (kill)
process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
