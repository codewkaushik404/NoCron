import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../state/useAuth.js";

/** Gate for /app: waits for the initial session check, then redirects anonymous visitors home. */
export default function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === "checking") {
    return (
      <div className="grid h-screen place-items-center bg-canvas">
        <Loader2 size={22} className="animate-spin text-ink-faint" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/" replace />;
  }

  return children;
}