import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

export const SESSION_COOKIE = "nocron_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionUser = {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
};

function secret(): string {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return value;
}

/** Signs a session JWT and sets it as an httpOnly cookie on the response. */
export function issueSession(res: Response, user: SessionUser) {
  const token = jwt.sign(user, secret(), { expiresIn: "7d" });

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Frontend and backend are on different origins in production (e.g. a
    // Vercel app calling a separate API host), which requires SameSite=None.
    // Locally they're both on localhost, where Lax works without HTTPS.
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: SESSION_MAX_AGE_MS,
  });
}

export function clearSession(res: Response) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
}

/** Reads and verifies the session cookie, if present. Returns null rather than throwing. */
export function readSession(req: Request): SessionUser | null {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;

  try {
    return jwt.verify(token, secret()) as SessionUser;
  } catch {
    return null;
  }
}
