import express from "express";
import config from "../config/config.js";
import { Worker } from "bullmq";
import prisma from "../config/prismaClient.js";
import executeWorkflow from "../services/workflow_execution.service.js";

const app = express();

async function workerServer(){
    const worker = new Worker(
        config.QUEUE_NAME, 
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
}

app.listen(config.WORKER_PORT, () => {
    console.log(`Worker service is running on port ${config.WORKER_PORT}`);
    workerServer();
});