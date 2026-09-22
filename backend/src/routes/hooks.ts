import { Router } from "express";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB, WORKFLOW_TABLE } from "../config/dynamoDB.js";
import { StartExecutionCommand } from "@aws-sdk/client-sfn";
import { stepFunctions } from "../config/stepFunctions.js";

const router = Router();

router.post("/:path", async (req, res) => {
    
    try {
        console.log(req.body);
        console.log(req.body.data.fields);
        const endpoint_path = `${req.params.path}`;

        // 1. Get the deployed workflow from DynamoDB
        const result = await dynamoDB.send(
            new GetCommand({
                TableName: WORKFLOW_TABLE,
                Key: {
                    endpoint_path,
                },
            })
        );

        // 2. Workflow doesn't exist
        if (!result.Item) {
            return res.status(404).json({
                message: "Workflow not found",
            });
        }

        const workflow = result.Item;

        // 3. Workflow is not active
        if (!workflow.is_active) {
            return res.status(409).json({
                message: "Workflow is not active",
            });
        }

        // 4. Get this workflow's state machine
        const stateMachineArn = workflow.state_machine_arn;

        if (!stateMachineArn) {
            throw new Error("State machine not configured");
        }

        // 5. Start that specific state machine
        const execution = await stepFunctions.send(
            new StartExecutionCommand({
                stateMachineArn,
                input: JSON.stringify(req.body),
            })
        );

        // 5. Return execution information
        return res.status(202).json({
            message: "Workflow execution started",
            executionArn: execution.executionArn
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to start workflow execution",
        });
    }
});

export default router;