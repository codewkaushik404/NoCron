import { useRecoilCallback, useRecoilValue } from "recoil";
import { userState, authStatusState } from "./authAtoms.js";
import { getApiBase } from "../lib/apiBase.js";

/**
 * All session state lives behind this hook: checking for an existing cookie
 * on load, handing a Google credential to the backend, and logging out.
 * Nothing else talks to /auth/* directly.
 */
export function useAuth() {
  const user = useRecoilValue(userState);
  const status = useRecoilValue(authStatusState);

  const checkSession = useRecoilCallback(
    ({ set }) =>
      async () => {
        const apiBase = getApiBase();
        if (!apiBase) {
          set(authStatusState, "anonymous");
          return;
        }

        try {
          const response = await fetch(`${apiBase}/auth/me`, {
            credentials: "include",
          });
          const data = await response.json();
          set(userState, data.user ?? null);
          set(authStatusState, data.user ? "authenticated" : "anonymous");
        } catch {
          set(userState, null);
          set(authStatusState, "anonymous");
        }
      },
    []
  );

  const loginWithGoogle = useRecoilCallback(
    ({ set }) =>
      async (credential) => {
        const apiBase = getApiBase();
        if (!apiBase) {
          throw new Error("Set VITE_BACKEND_DEPLOY_URL in frontend/.env before signing in.");
        }

        const response = await fetch(`${apiBase}/auth/google`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.message ?? "Google sign-in failed.");
        }

        const data = await response.json();
        set(userState, data.user);
        set(authStatusState, "authenticated");
        return data.user;
      },
    []
  );

  const logout = useRecoilCallback(
    ({ set }) =>
      async () => {
        const apiBase = getApiBase();
        if (apiBase) {
          await fetch(`${apiBase}/auth/logout`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        }
        set(userState, null);
        set(authStatusState, "anonymous");
      },
    []
  );

  return { user, status, checkSession, loginWithGoogle, logout };
}