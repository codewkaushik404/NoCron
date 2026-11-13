import publishOutboxToQueue from "../../services/outbox.service.js";
import prisma from "../../config/prismaClient.js";

const POLLING_INTERVAL = 1*60*1000; //1 min
let isShuttingDown = false;
let shutdownStarted = false;
let timeout: NodeJS.Timeout | null = null;

async function startSweeper(){
    console.log("Sweeper Started");

    while(!isShuttingDown){
        try{
            await publishOutboxToQueue();
        }
        catch(err){
            console.error("Error in sweeperServer: ", err);
        }

        if(isShuttingDown) break;

        await new Promise((resolve, _reject) => timeout = setTimeout(resolve, POLLING_INTERVAL));
        timeout = null;
    }
}

const sweeperPromise: Promise<void> = startSweeper();

async function shutdown(signal: string) : Promise<void> {
    if(shutdownStarted) return ;

    shutdownStarted = true;
    console.log(`${signal} received. Shutting down...`);

    isShuttingDown = true;
    if(timeout) clearTimeout(timeout);

    await sweeperPromise;
    await prisma.$disconnect();
    console.log("Sweeper shutdown complete");
}

//SIGINT -> signal interrupt(ctrl+c) SIGTERM -> signal terminate (kill)
process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

