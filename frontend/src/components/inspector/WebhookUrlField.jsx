import { useState } from "react";
import { Check, Copy, Webhook } from "lucide-react";
import { useRecoilValue } from "recoil";

import { workflowMetaState } from "../../state/atoms.js";
import { useAuth } from "../../state/useAuth.js";
import { getApiBase } from "../../lib/apiBase.js";

export default function WebhookUrlField() {
  const { user } = useAuth();
  const meta = useRecoilValue(workflowMetaState);
  const [copied, setCopied] = useState(false);

  const apiBase = getApiBase();

  const webhookUrl =
    apiBase && user?.id && meta.workflowId
      ? `${apiBase}/api/v1/hooks/catch/${user.id}/${meta.workflowId}`
      : null;

  async function copyUrl() {
    if (!webhookUrl) return;

    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-indigo-600 shadow-sm">
          <Webhook size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-800">
            Webhook endpoint
          </p>

          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Send a POST request here to start this workflow.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-indigo-100 bg-white p-2.5">
        {webhookUrl ? (
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate text-[11px] text-slate-700">
              {webhookUrl}
            </code>

            <button
              type="button"
              onClick={copyUrl}
              aria-label="Copy webhook URL"
              className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              {copied ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        ) : (
          <p className="text-[11px] leading-5 text-slate-500">
            Publish this workflow first. Your webhook URL will appear here.
          </p>
        )}
      </div>
    </section>
  );
}
