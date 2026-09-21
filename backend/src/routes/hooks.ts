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

        const obj = workflow.node_config.nodes.find((node: any) => node.type === "sendEmail");
        const {recipient, subject} = obj.data;
        
        // 4. Start the Step Functions execution
        const execution = await stepFunctions.send(
            new StartExecutionCommand({
                stateMachineArn: process.env.STATE_MACHINE_ARN!,
                input: JSON.stringify({recipient, subject, body: req.body}),
            })
        );

        console.log("execution done");
        // 5. Return execution information
        return res.status(202).json({
            message: "Workflow execution started"
        });

    } catch (error) {
        console.error("Workflow execution error:", error);

        return res.status(500).json({
            message: "Failed to start workflow execution",
        });
    }
});

export default router;