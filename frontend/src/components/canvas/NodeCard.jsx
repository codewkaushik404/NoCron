import { Trash2 } from "lucide-react";
import { accentStyles, catalogByType } from "../../lib/nodeCatalog.js";

export default function NodeCard({ node, selected, onSelect, onDelete }) {
  const entry = catalogByType[node.type];

  if (!entry) return null;

  const Icon = entry.icon;
  const accent = accentStyles[entry.accent];
  const summaryValue = entry.summaryKey ? node.data[entry.summaryKey] : null;

  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`group relative w-[248px] cursor-pointer overflow-hidden rounded-2xl border bg-panel p-3.5 transition-all ${
        selected
          ? "border-cyan shadow-node ring-2 ring-cyan/15"
          : "border-line shadow-panel hover:-translate-y-0.5 hover:border-line-strong hover:shadow-node"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center gap-3">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${accent.iconWrap}`}
        >
          <Icon size={16} strokeWidth={2} />
        </span>

        <h4 className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
          {node.data.name}
        </h4>

        <button
          type="button"
          aria-label={`Delete ${node.data.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(node.id);
          }}
          className="rounded-md p-1 text-ink-faint hover:bg-raised hover:text-cyan"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {entry.service ? (
        <span
          className={`mt-3 inline-flex rounded-full border border-current/10 px-2.5 py-1 font-mono text-[10px] ${accent.chip}`}
        >
          {entry.service}
        </span>
      ) : null}

      {summaryValue ? (
        <p className="mt-2 truncate rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-[11px] text-ink-soft">
          {entry.summaryKey}: {String(summaryValue)}
        </p>
      ) : null}
    </div>
  );
}
