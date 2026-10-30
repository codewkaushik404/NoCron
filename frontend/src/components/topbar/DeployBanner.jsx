import { useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, X } from "lucide-react";
import { useDeploy } from "../../state/useDeploy.js";

export default function DeployBanner() {
  const { status, dismiss } = useDeploy();
  const [copied, setCopied] = useState(false);

  if (status.phase === "idle" || status.phase === "deploying") {
    return null;
  }

  const isError = status.phase === "error";

  async function copyWebhookUrl() {
    if (!status.webhookUrl) return;

    try {
      await navigator.clipboard.writeText(status.webhookUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`relative z-50 border-b px-5 py-3 ${
        isError
          ? "border-rose-200 bg-rose-50 text-rose-950"
          : "border-emerald-200 bg-emerald-50 text-emerald-950"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1500px] items-start gap-3">
        {isError ? (
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-rose-600" />
        ) : (
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0 text-emerald-600"
          />
        )}

        <div className="min-w-0 flex-1">
          {isError ? (
            <>
              <p className="text-sm font-semibold">
                Fix these before publishing
              </p>

              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-rose-800">
                {status.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">
                {status.message || "Workflow published successfully."}
              </p>

              {status.webhookUrl ? (
                <div className="mt-2 max-w-3xl">
                  <p className="text-xs text-emerald-800">
                    Send requests to this URL to trigger your workflow. You can
                    also click the webhook trigger to view it again.
                  </p>

                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-white/80 px-3 py-2">
                    <code className="min-w-0 flex-1 truncate text-xs text-emerald-950">
                      {status.webhookUrl}
                    </code>

                    <button
                      type="button"
                      onClick={copyWebhookUrl}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied" : "Copy URL"}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="ml-auto shrink-0 rounded-md bg-white/70 p-1 text-current/70 transition hover:bg-white hover:text-current"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
