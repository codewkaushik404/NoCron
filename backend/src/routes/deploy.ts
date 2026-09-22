import { Router } from "express";
import { workflowSchema } from "../schemas/workflowSchema.js";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB, WORKFLOW_TABLE } from "../config/dynamoDB.js";
import { buildStateMachineDefinition } from "../services/buildStateMachineDefinition.js";
import { stepFunctions } from "../config/stepFunctions.js";
import {
  CreateStateMachineCommand,
  UpdateStateMachineCommand,
  ListStateMachinesCommand,
} from "@aws-sdk/client-sfn";

const router = Router();

router.patch("/:hookId", async (req, res) => {
    
    try {
        const endpoint_path = `${req.params.hookId}`;

        const { is_active } = req.body;

        if (typeof is_active !== "boolean") {
            return res.status(400).json({
                message: "is_active must be a boolean",
            });
        }

        const result = await dynamoDB.send(
            new UpdateCommand({
                TableName: WORKFLOW_TABLE,
                Key: {
                    endpoint_path,
                },
                UpdateExpression: "SET is_active = :is_active",
                ExpressionAttributeValues: {
                    ":is_active": is_active,
                },
                ReturnValues: "ALL_NEW",
            })
        );

        if (!result.Attributes) {
            return res.status(404).json({
                message: "Workflow not found",
            });
        }

        return res.json({
            message: "Workflow status updated",
            is_active: result.Attributes.is_active,
        });

    } 
    catch (error) {
        return res.status(500).json({ message: "Failed to update workflow status" });
    }
});

/** Workflows when deployed come here and get stored in DB */
router.post("/:path", async (req, res) => {
    try{
        const endpoint_path = `${req.params.path}`;
        const result = workflowSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
            message: "Invalid workflow payload",
            errors: result.error.issues,
            });
        }

        const workflow = result.data

        const stateMachineDefinition = buildStateMachineDefinition(workflow);
        const definition = JSON.stringify(stateMachineDefinition);

        const stateMachineName = `NoCron-${req.params.path}`;
        let stateMachineArn : string;

        const existing = await stepFunctions.send(new ListStateMachinesCommand({}));
        const existingMachine = existing.stateMachines?.find((machine) => machine.name === stateMachineName );

        //update existing stateMachine
        if (existingMachine?.stateMachineArn) {
            await stepFunctions.send(
                new UpdateStateMachineCommand({
                    stateMachineArn: existingMachine.stateMachineArn,
                    definition,
                })
            );

            stateMachineArn = existingMachine.stateMachineArn;
        } 
        //or create a new one
        else {

            const created = await stepFunctions.send(
                new CreateStateMachineCommand({
                    name: stateMachineName,
                    definition,
                    roleArn: process.env.STATE_MACHINE_ROLE_ARN!,
                    type: "STANDARD",
                })
            );

            if (!created.stateMachineArn) throw new Error("State machine ARN was not returned");

            stateMachineArn = created.stateMachineArn;
        }

        await dynamoDB.send(
            new PutCommand({
                TableName: WORKFLOW_TABLE,
                Item: {
                    ...workflow,
                    endpoint_path,
                    state_machine_arn: stateMachineArn
                }
            })
        );    

        res.json({
            message: "Workflow deplpoyed",
            endpoint_path,
            state_machine_arn: stateMachineArn
        });
    }
    catch(err: any){
        return res.status(500).json({ message: err.message ?? "Failed to deploy workflow"});
    }
});

export default router;
