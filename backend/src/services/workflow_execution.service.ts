import type { Job } from "bullmq";
import prisma from "../config/prismaClient.js";
import sendEmail from "../actions/email.action.js";
import actionConfigRegistry from "../types/action-config.registry.js";
import sendMessage from "../actions/sendMessage.action.js";
import { z } from "zod";
import validateConfig from "../utils/validateConfig.js";

export default async function executeWorkflow(job: Job){
    try{
        const record = await prisma.execution.findUnique({
            where: {id: job.data.execution_id},
            include: {
                workflow: {
                    include: {
                        trigger: true,
                        actions: {
                            orderBy: {order: "asc"},
                            include: {
                                action: true
                            }
                        }
                    }
                }
            }
        })

        if (!record) throw new Error(`Execution not found: ${job.data.execution_id}`);

        for(const action of record.workflow.actions){
            switch(action.action.name){
                case "sendEmail": 
                    await sendEmail(validateConfig(actionConfigRegistry.sendEmail, "sendEmail", action.config));
                    break;
                
                case "sendSlackMessage": {
                    const messageConfig = validateConfig(actionConfigRegistry.sendSlackMessage, "sendSlackMessage", action.config);
                    await sendMessage(action.action.name, messageConfig.webhook_url, messageConfig.message);
                    break;
                }

                case "sendDiscordMessage": {
                    const messageConfig = validateConfig(actionConfigRegistry.sendDiscordMessage, "sendDiscordMessage", action.config);
                    await sendMessage(action.action.name, messageConfig.webhook_url, messageConfig.message);
                    break;
                }

                case "wait": {
                    const result = validateConfig(actionConfigRegistry.wait, "wait", action.config);
                    await new Promise((resolve, _reject) => {
                        setTimeout(resolve, result.wait_time*60*1000);
                    })
                    break;
                }
                
                default: throw new Error(`Unsupported action : ${action.action.name}`);
            }
        }
    }
    catch(err){
        console.error(`Error while executing ${job.data.execution_id}: `,err);
        throw err;
    }
}