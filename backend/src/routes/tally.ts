import { Router } from "express";
import {GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import {dynamoDB, TALLY_CONNECTIONS_TABLE } from "../config/dynamoDB.js";

const router = Router();
const TALLY_API = "https://api.tally.so";

/** fetch forms from api key sent in req and save it to DB*/
router.post("/forms", async (req, res) => {

    try {
        const { apiKey, user_id } = req.body;

        if (!apiKey || typeof apiKey !== "string") {
            return res.status(400).json({
                message: "Tally API key is required",
            });
        }

        const tallyResponse = await fetch(`${TALLY_API}/forms`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                },
            }
        );

        if (!tallyResponse.ok) {
            return res.status(401).json({
                message: "Invalid Tally API key",
            });
        }

        const data = await tallyResponse.json();

        const connectionId = `tally_${crypto.randomUUID()}`;

        await dynamoDB.send(
            new PutCommand({
                TableName: TALLY_CONNECTIONS_TABLE,
                Item: {
                    connection_id: connectionId,
                    api_key: apiKey,
                    user_id : user_id ?? null
                },
            })
        );

        const forms = (data.items ?? []).map((form: any) => ({
                id: form.id,
                name: form.name,
            })
        );

        return res.status(201).json({ connection_id: connectionId, forms });
    } 
    catch (error) {
        return res.status(500).json({ message: "Failed to connect Tally" });
    }
});


/** Get fields/questions for a selected form based on formId */
router.get("/forms/:formId/fields", async (req, res) => {
    
    try {
        const { formId } = req.params;
        const { connection_id : connectionId } = req.query;

        if (!connectionId || typeof connectionId !== "string") {
            return res.status(400).json({
                message: "tallyAccountId is required",
            });
        }

        const accountResult = await dynamoDB.send(
            new GetCommand({
                TableName: TALLY_CONNECTIONS_TABLE,
                Key: {
                    connection_id: connectionId,
                },
            })
        );

        if (!accountResult.Item) {
        return res.status(404).json({
            message: "Tally account not found",
        });
        }

        const tallyResponse = await fetch(`https://api.tally.so/forms/${formId}/questions`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accountResult.Item.api_key}`,
                    Accept: "application/json",
                },
            }
        );

        if (!tallyResponse.ok) {
            throw new Error("Failed to fetch form fields");
        }

        const data = await tallyResponse.json();

        const fields = (data.questions ?? []).map((question: any) => ({
            key: question.id,
            label: question.title,
            type: question.type,
        }));

        return res.json({ fields });
    } 

    catch (error : any) {
        return res.status(500).json({ message: error.message ?? "Failed to fetch form fields" });
    }
});

export default router;