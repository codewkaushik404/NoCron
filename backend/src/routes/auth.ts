import { Router } from "express";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB, USERS_TABLE } from "../config/dynamoDB.js";
import { verifyGoogleCredential } from "../config/googleAuth.js";
import { googleCredentialSchema } from "../schemas/authSchema.js";
import { issueSession, clearSession, readSession } from "../config/session.js";

const router = Router();

/** Frontend's Google Sign-In button posts its ID token here. */
router.post("/google", async (req, res) => {
  try {
    const result = googleCredentialSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: result.error.issues,
      });
    }

    const profile = await verifyGoogleCredential(result.data.credential);

    const existing = await dynamoDB.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { user_id: profile.googleId },
      })
    );

    const now = new Date().toISOString();

    await dynamoDB.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          user_id: profile.googleId,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          created_at: existing.Item?.created_at ?? now,
          last_login_at: now,
        },
      })
    );

    const sessionUser = {
      sub: profile.googleId,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    };

    issueSession(res, sessionUser);

    return res.json({ user: sessionUser });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message ?? "Failed to verify Google credential",
    });
  }
});

/** Frontend calls this on load to check for an existing session. Always 200. */
router.get("/me", (req, res) => {
  const user = readSession(req);
  return res.json({ user });
});

router.post("/logout", (req, res) => {
  clearSession(res);
  return res.json({ message: "Logged out" });
});

export default router;
