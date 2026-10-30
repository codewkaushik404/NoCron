import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  userState,
  authStatusState,
  authenticatedState,
} from "./authAtoms.js";
import { apiUrl, getApiBase } from "../lib/apiBase.js";

export function useAuth() {
  const user = useRecoilValue(userState);
  const status = useRecoilValue(authStatusState);
  const authenticated = useRecoilValue(authenticatedState);

  const checkSession = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (!getApiBase()) {
          set(userState, null);
          set(authStatusState, "anonymous");
          set(authenticatedState, false);
          return;
        }

        try {
          const response = await fetch(apiUrl("/api/auth/me"), {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("No active session.");
          }

          const result = await response.json();
          const currentUser = result.data ?? null;
          const isAuthenticated = Boolean(currentUser);

          set(userState, currentUser);
          set(authStatusState, isAuthenticated ? "authenticated" : "anonymous");
          set(authenticatedState, isAuthenticated);
        } catch {
          set(userState, null);
          set(authStatusState, "anonymous");
          set(authenticatedState, false);
        }
      },
    [],
  );

  const logout = useRecoilCallback(
    ({ set }) =>
      async () => {
        try {
          if (getApiBase()) {
            await fetch(apiUrl("/api/auth/logout"), {
              method: "DELETE",
              credentials: "include",
            });
          }
        } finally {
          set(userState, null);
          set(authStatusState, "anonymous");
          set(authenticatedState, false);
        }
      },
    [],
  );

  return {
    user,
    status,
    authenticated,
    checkSession,
    logout,
  };
}
