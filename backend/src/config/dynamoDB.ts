import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
});

export const dynamoDB = DynamoDBDocumentClient.from(client);

export const WORKFLOW_TABLE = process.env.WORKFLOWS;
export const TALLY_CONNECTIONS_TABLE = process.env.TALLYCONNECTIONS;