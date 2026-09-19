import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { hookUrl } from "../../lib/ids.js";

/** Read-only URL display with copy-to-clipboard, shown above a webhook node's fields. */
export default function WebhookUrlField({ hookId }) {
  const [copied, setCopied] = useState(false);
  const url = hookUrl(hookId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (insecure context, permissions) — fail quietly.
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-xs text-ink-soft">Webhook URL</span>
      <div className="flex items-center gap-2 rounded-lg border border-line bg-raised/60 px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink">{url}</span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy webhook URL"
          className="nodrag shrink-0 rounded p-1 text-ink-faint hover:bg-panel hover:text-cyan"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}