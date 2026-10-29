import { Router } from "express";
import prisma from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import createExecution from "../services/execution.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";

const router = Router();

router.post("/catch/:userId/:workflowId", asyncHandler(async (req: Request, res: Response) => {
    
    const {userId, workflowId} = req.params;

    if (typeof userId !== "string") throw new ApiError(400, "Invalid userId", null);
    if (typeof workflowId !== "string") throw new ApiError(400, "Invalid workflowId", null);
    

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            user_id: userId
        }
    })

    if(!workflow) throw new ApiError(404, "Workflow not found", null);

    if(workflow.status !== "ACTIVE") throw new ApiError(409, "Workflow is not active", null);

    //creates execution and execution outbox records in db
    await createExecution(workflowId);

    return res.status(201).json(new ApiResponse(201, "Workflow execution request received", null));
}));

export default router;