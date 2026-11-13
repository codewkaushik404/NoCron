import config from "../../config/config.js";
import { Worker } from "bullmq";
import prisma from "../../config/prismaClient.js";
import executeWorkflow from "../../services/workflow_execution.service.js";

const worker = new Worker(config.QUEUE_NAME, 
    async (job) => {
        await executeWorkflow(job);
    },
    {
        connection: {
            host: config.REDIS_HOST,
            port: Number(config.REDIS_PORT)
        }
    }
);

worker.on("error", (err) => {
    console.error("Worker error: ", err);
});

worker.on("failed", async (job, err) => {
    if(!job) return ;

    const maxAttempts = job.opts.attempts ?? 1;
    if(job.attemptsStarted >= maxAttempts){
        try{
            await prisma.execution.update({
                where: {id: job.data.execution_id},
                data: {status: "FAILED"}
            })

            console.log(`Execution ${job.data.execution_id} marked as FAILED`);
        }
        catch(err){
            console.error(`Failed to mark execution ${job.data.execution_id} as FAILED: `, err);
        }
    }
})

worker.on("completed", async (job) => {
    try{
        await prisma.execution.update({
            where: {id: job.data.execution_id},
            data: {status: "SUCCEEDED"}
        })

        console.log(`Execution ${job.data.execution_id} marked as SUCCEEDED`);
    }
    catch(err){
        console.error(`Failed to mark execution ${job.data.execution_id} as SUCCEEDED: `, err);
    }
})

async function shutdown(signal: string){
    console.log(`${signal} received. Shutting down worker...`);

    try {
        // Stop fetching new jobs and wait for active jobs to finish
        await worker.close();

        // Close database connection
        await prisma.$disconnect();

        console.log("Worker shut down successfully");
    } catch (error) {
        console.error("Worker shutdown failed:", error);
        process.exitCode = 1;
    }
}

//SIGINT -> signal interrupt(ctrl+c) SIGTERM -> signal terminate (kill)
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
