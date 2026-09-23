import { atom } from "recoil";

/** The signed-in user, or null. Mirrors the session cookie the backend holds. */
export const userState = atom({
  key: "user",
  default: null,
});

/** checking (initial /auth/me call in flight) | authenticated | anonymous */
export const authStatusState = atom({
  key: "authStatus",
  default: "checking",
});

