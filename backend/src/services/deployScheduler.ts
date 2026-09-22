import {
  CreateScheduleCommand,
  UpdateScheduleCommand,
  DeleteScheduleCommand
} from "@aws-sdk/client-scheduler";

import {scheduler} from "../config/scheduler.js";


type ScheduleTrigger = {
    data: Record<string, unknown>;
}

export async function createOrUpdateScheduler({
    workflowPath,
    stateMachineArn,
    scheduleTrigger,
    existingScheduleArn,
}: {
    workflowPath: string;
    stateMachineArn: string;
    scheduleTrigger: ScheduleTrigger;
    existingScheduleArn?: string;
}) {
    
    const scheduleName = `NoCron-${workflowPath}`;

    const targetInput = JSON.stringify({ endpoint_path: `${workflowPath}` });

    const target = {
        Arn: stateMachineArn,
        RoleArn: process.env.SCHEDULER_ROLE_ARN!,
        Input: targetInput,
    };

    const expression = scheduleTrigger.data.expression;

    if (typeof expression !== "string" || !expression) {
        throw new Error("Schedule trigger must have a valid expression");
    }

    const timezone = (
        typeof scheduleTrigger.data.timezone === "string"
            ? scheduleTrigger.data.timezone
            : "UTC"
    );

    // Existing scheduler → update it
    if (existingScheduleArn) {
        await scheduler.send(
            new UpdateScheduleCommand({

                Name: scheduleName,
                ScheduleExpression: expression,
                ScheduleExpressionTimezone: timezone,

                FlexibleTimeWindow: {
                    Mode: "OFF",
                },

                State: "ENABLED",
                Target: target,
            })
        );
    
        return {
            scheduleName,
            scheduleArn: existingScheduleArn,
            action: "updated",
        };
    }

    // No scheduler yet → create it
    const result = await scheduler.send(
        new CreateScheduleCommand({

            Name: scheduleName,
            ScheduleExpression: expression,
            ScheduleExpressionTimezone: timezone,

            FlexibleTimeWindow: {
                Mode: "OFF",
            },

            State: "ENABLED",
            Target: target,
        })
    );

    return {
        scheduleName,
        scheduleArn: result.ScheduleArn,
        action: "created",
    };
}

export async function deleteScheduler( scheduleName: string ) {
    await scheduler.send(
        new DeleteScheduleCommand({
            Name: scheduleName,
        })
    );
}