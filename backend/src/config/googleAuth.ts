import { OAuth2Client } from "google-auth-library";

/**
 * Verifies the ID token the frontend's Google Sign-In button produces.
 * This is the "verify an ID token" flow — the Client ID is the only
 * credential needed here, since we're checking a token Google already
 * signed, not exchanging an authorization code server-side.
 */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

export const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleCredential(credential: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Google token did not include the expected profile fields");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    picture: payload.picture ?? null,
  };
}
