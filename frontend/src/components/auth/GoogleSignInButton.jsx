import { LogIn } from "lucide-react";
import { getApiBase } from "../../lib/apiBase.js";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  const signIn = () => {
    const apiBase = getApiBase();

    if (!apiBase) {
      window.alert("Set VITE_BACKEND_DEPLOY_URL in frontend/.env.");
      return;
    }

    window.location.assign(`${apiBase}/api/auth/google`);
  };

  return (
    <button
      type="button"
      onClick={signIn}
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
}
