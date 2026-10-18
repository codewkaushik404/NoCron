import { z } from "zod";

/** Body shape for POST /auth/google — the ID token Google's button returns. */
export const googleCredentialSchema = z.object({
  credential: z.string().min(1),
});
