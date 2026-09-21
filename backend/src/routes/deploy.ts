import { Router } from "express";
import { workflowSchema } from "../schemas/workflowSchema.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB, WORKFLOW_TABLE } from "../config/dynamoDB.js";

const router = Router();

/** Workflows when deployed come here and get stored in DB */
router.post("/:path", async (req, res) => {
    
    const endpoint_path = `${req.params.path}`;
    const result = workflowSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
        message: "Invalid workflow payload",
        errors: result.error.issues,
        });
    }

    const workflow = {
        endpoint_path,
        ...result.data,
    };

    await dynamoDB.send(
        new PutCommand({
            TableName: WORKFLOW_TABLE,
            Item: workflow,
        })
    );

    res.json({
        message: "Workflow received",
        endpoint_path,
    });
});

export default router;
