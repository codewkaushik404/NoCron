import express from "express";
import cors from "cors";
import "dotenv/config";
import { workflowSchema } from "./schemas/workflowSchema.js";
import { PutCommand, GetCommand  } from "@aws-sdk/lib-dynamodb";
import { dynamoDB, WORKFLOW_TABLE } from "./config/dynamoDB.js";
import { StartExecutionCommand } from "@aws-sdk/client-sfn";
import { stepFunctions } from "./config/stepFunctions.js";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is healthy");
});

/** Workflows when deployed come here and get stored in DB */
app.post("/deploy/:path", async (req, res) => {
    
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

app.post("/hooks/:path", async (req, res) => {
    try {
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


app.listen(PORT, () => {
    console.log(`Server is running\nhttp://localhost:${PORT}`);
});