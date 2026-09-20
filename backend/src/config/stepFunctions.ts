import { SFNClient } from "@aws-sdk/client-sfn";

export const stepFunctions = new SFNClient({
  region: process.env.AWS_REGION!,
});