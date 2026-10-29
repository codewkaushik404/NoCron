import prisma from "../config/prismaClient.js";
import executionQueue from "../config/queue.js";

export default async function publishOutboxToQueue(): Promise<void> {
    
    console.log("Publishing execution outbox to queue...");

    const records = await prisma.executionOutbox.findMany({
        where: {},
        take: 100
    });

    const jobs = records.map((r) => {
        return {
            name: "execution_workflow",
            data: r,
            opts: {
                jobId: r.id,
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000
                }
            }
        }
    })

    await executionQueue.addBulk(jobs);
    console.log(`Published ${records.length} records to the queue.`);

    await prisma.executionOutbox.deleteMany({
        where: {
            id: {
                in: records.map((r) => r.id)
            }
        }
    });
    console.log(`Deleted ${records.length} records from the outbox.`);
}