import {
    SchedulerClient,
    CreateScheduleCommand,
    UpdateScheduleCommand,
} from "@aws-sdk/client-scheduler";

export const scheduler = new SchedulerClient({
  region: process.env.AWS_REGION!,
});
