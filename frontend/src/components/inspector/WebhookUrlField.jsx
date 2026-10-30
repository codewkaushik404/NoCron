import { useState } from "react";
import { Check, Copy } from "lucide-react";
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

      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs text-ink-soft">Webhook URL</span>

      <div className="rounded-lg border border-line bg-raised/60 p-3">
        {webhookUrl ? (
          <div className="flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink">
              {webhookUrl}
            </span>

            <button
              type="button"
              onClick={copyUrl}
              aria-label="Copy webhook URL"
              className="shrink-0 rounded p-1 text-ink-faint hover:text-teal"
            >
              {copied ? (
                <Check size={14} className="text-teal" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-ink-faint">
            Publish this workflow to generate its webhook URL.
          </p>
        )}
      </div>
    </div>
  );
}
