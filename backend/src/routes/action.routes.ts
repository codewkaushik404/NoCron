import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/prismaClient.js"
import ApiResponse from "../utils/ApiResponse.js";
import actionConfigRegistry from "../types/action-config.registry.js";
import getConfigFields from "../types/config-fields.js";

const router = Router();

router.get("/available", asyncHandler(async (req, res) => {
    if(!req.isAuthenticated()) throw new ApiError(401, "User not authenticated", null);

    const records = await prisma.availableAction.findMany({
        where: {},
        omit: {
            created_at: true,
            updated_at: true
        }
    })

    const actions = records.flatMap((record) => {
        const schema = actionConfigRegistry[record.name as keyof typeof actionConfigRegistry];
        return schema
            ? [{ ...record, fields: getConfigFields(schema) }]
            : [];
    });

    if(actions.length === 0) return res.json(new ApiResponse(200, "No actions found", null));

    return res.json(new ApiResponse(200, "Available Actions fetched successfully", actions));
}))

export default router;