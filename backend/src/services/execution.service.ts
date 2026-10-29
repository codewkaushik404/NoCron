import prisma from "../config/prismaClient.js";

async function createExecution(workflowId: string){
    
    return prisma.$transaction(async (tx) => {
        const execution = await tx.execution.create({
            data: {
                workflow_id: workflowId,
            }
        })

        const execution_outbox = await tx.executionOutbox.create({
            data: {
                execution_id: execution.id
            }
        })

        return execution_outbox;
    })
}

export default createExecution;