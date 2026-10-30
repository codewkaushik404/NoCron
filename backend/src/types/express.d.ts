import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      googleId: string;
      email: string;
      name: string;
      avatar_url?: string;
      created_at?: Date;
      updated_at?: Date;
    }
  }
}

export {};