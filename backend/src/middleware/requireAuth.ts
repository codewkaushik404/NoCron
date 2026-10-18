import type { NextFunction, Request, Response } from "express";
import { readSession, type SessionUser } from "../config/session.js";

// Extend Express's Request type so routes get req.user without a cast.
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

/** Blocks the request with 401 unless a valid session cookie is present. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = readSession(req);

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  req.user = user;
  next();
}
