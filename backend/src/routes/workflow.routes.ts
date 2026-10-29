import { Router } from "express";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/prismaClient.js";
import { idSchema, workflowSchema } from "../types/types.js";
import ApiResponse from "../utils/ApiResponse.js";
import validateConfig from "../utils/validateConfig.js";
import triggerConfigRegistry from "../types/trigger-config.registry.js";
import actionConfigRegistry from "../types/action-config.registry.js";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {

    if(!req.isAuthenticated()){
        throw new ApiError(401, "User not authenticated", null);
    }

    const workflows = await prisma.workflow.findMany({
        where: {user_id: req.user.id},
        orderBy: {updated_at: "desc"},
        take: 10
    })

    if(!workflows) throw new ApiError(404, "Workflows not found", null);

    return res.json(new ApiResponse(200, "Workflows fetched successfully", workflows));
}))

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {

    const workflowId = req.params.id;

    const validation = idSchema.safeParse(workflowId);
    if(!validation.success) throw new Error("Invalid workflow Id", {cause: validation.error});

    if(!req.isAuthenticated()){
        throw new ApiError(401, "User not authenticated", null);
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: validation.data,
            user_id: req.user.id
        },
        include: {
            trigger: {
                include: {
                    trigger: true
                }
            },
            actions: {
                orderBy: {order: "asc"},
                include: {
                    action: true
                }
            },
            executions: true
        }
    })

    if(!workflow) throw new ApiError(404, "Workflow not found", null);

    return res.json(new ApiResponse(200, "Workflow fetched successfully", workflow));
}))

/**
 * {
    "name": "GitHub Issue Notifications",
    "trigger": {
        "name": triger-name,
        "type": "webhook",
        "config": {}
    },
    "actions": [
    {
      "name": actionname,  
      "type": "sendDiscordMessage",
      "config": {
        "webhookUrl": "https://discord.com/api/webhooks/...",
        "content": "A new issue was created."
       },
      order: 1
    }]
}
 */
router.post("/publish", asyncHandler(async (req: Request, res: Response) => {
    if(!req.isAuthenticated()) throw new ApiError(401, "User not authenticated", null);

    const isValid = workflowSchema.safeParse(req.body);
    if(!isValid.success) throw new ApiError(400, "Invalid data sent", isValid.error.issues);

    const data = isValid.data;
    const trigger_type = await prisma.availableTrigger.findUnique({
        where: {
            name: data.trigger.type,
        }
    })

    if(!trigger_type) throw new ApiError(400, "Invalid data sent", [`Invalid Trigger type - ${data.trigger.name}`]);

    const triggerConfig = triggerConfigRegistry[trigger_type.name as keyof typeof triggerConfigRegistry];
    if(!triggerConfig) throw new ApiError(400, "Invalid data sent", [`Unsupported Trigger type - ${trigger_type.name}`]);

    validateConfig(triggerConfig, trigger_type.name, data.trigger.config);
    
    const actionsData = await Promise.all(data.actions.map(async (action) => {
        const action_type = await prisma.availableAction.findUnique({
            where: {
                name: action.type,
            }
        })
        
        if(!action_type) throw new ApiError(400, "Invalid data sent", [`Invalid Action type - ${action.type}`]);

        const actionConfig = actionConfigRegistry[action_type.name as keyof typeof actionConfigRegistry];
        if(!actionConfig) throw new ApiError(400, "Invalid data sent", [`Unsupported Action type - ${action.type}`]);

        validateConfig(actionConfig, action_type.name, action.config);

        return {
            name: action.name,
            action_type_id: action_type.id,
            order: action.order,
            config: action.config
        }
    }));

    await prisma.$transaction(async (tx) => {
        const workflow = await tx.workflow.create({
            data: {
                name: data.name,
                user_id: req.user.id,
                status: "ACTIVE"
            },
            select: {
                id: true
            }
        })

        await tx.trigger.create({
            data: {
                name: data.trigger.name,
                config: data.trigger.config as any,
                trigger_type_id: trigger_type.id,
                workflow_id: workflow.id
            }
        })

        await tx.action.createMany({
            data: actionsData.map((action) => ({
                ...action,
                config: action.config as any,
                workflow_id: workflow.id
            }))
        })
    })

    return res.status(201).json(new ApiResponse(201, "New workflow created successfully", null));
}))

export default router;