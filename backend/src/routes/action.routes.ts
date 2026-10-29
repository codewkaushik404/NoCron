import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/prismaClient.js"
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

router.get("/available", asyncHandler(async (req, res) => {
    if(!req.isAuthenticated()) throw new ApiError(401, "User not authenticated", null);

    const actions = await prisma.availableAction.findMany({
        where: {},
        omit: {
            created_at: true,
            updated_at: true
        }
    })

    if(actions.length === 0) return res.json(new ApiResponse(200, "No actions found", null));

    return res.json(new ApiResponse(200, "Available Actions fetched successfully", actions));
}))

export default router;