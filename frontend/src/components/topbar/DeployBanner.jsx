import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useDeploy } from "../../state/useDeploy.js";

/** Surfaces the last deploy attempt's result: a list of fixes needed, or a success line. */
export default function DeployBanner() {
  const { status, dismiss } = useDeploy();

  if (status.phase === "idle" || status.phase === "deploying") return null;
  const isError = status.phase === "error";

  return (
    <div
      className={`flex items-start gap-3 border-b px-5 py-3 text-sm ${
        isError ? "border-rose-200 bg-rose-50 text-rose-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
    >
      {isError ? (
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        {isError ? (
          <>
            <p className="font-semibold">Fix these before deploying</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-rose-800">
              {status.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="font-semibold">
            {status.message || "Workflow deployed. It's live and listening."}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded p-1 hover:bg-black/5"
      >
        <X size={14} />
      </button>
    </div>
  );
}