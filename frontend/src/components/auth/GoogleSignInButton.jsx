import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "../../state/useAuth.js";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let scriptPromise = null;

/** Loads accounts.google.com's client script once, however many buttons mount. */
function loadGoogleScript() {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google's sign-in script"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Renders Google's own "Sign in with Google" button (via Google Identity
 * Services) and hands the resulting ID token to useAuth().loginWithGoogle,
 * which sends it to the backend for verification.
 */
export default function GoogleSignInButton({ onSuccess, size = "large" }) {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
    if (!clientId) {
      setError("Set VITE_GOOGLE_CLIENT_ID in frontend/.env to enable Google sign-in.");
      return;
    }

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            try {
              const user = await loginWithGoogle(credential);
              onSuccess?.(user);
            } catch (err) {
              setError(err.message ?? "Google sign-in failed.");
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size,
          shape: "pill",
          text: "continue_with",
        });
      })
      .catch((err) => setError(err.message));

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, onSuccess, size]);

  return (
    <div>
      <div ref={buttonRef} />
      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-700">
          <AlertTriangle size={13} className="shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}