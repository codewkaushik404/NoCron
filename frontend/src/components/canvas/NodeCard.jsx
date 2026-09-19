import { Trash2 } from "lucide-react";
import { accentStyles, catalogByType } from "../../lib/nodeCatalog.js";

/** Presentational card for a placed block. FlowNode wraps this with handles. */
export default function NodeCard({ node, selected, onSelect, onDelete }) {
  const entry = catalogByType[node.type];
  if (!entry) return null;

  const Icon = entry.icon;
  const accent = accentStyles[entry.accent];
  const summaryValue = node.data[entry.summaryKey];

  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`w-[255px] cursor-pointer rounded-2xl border bg-panel/95 p-3.5 backdrop-blur transition-shadow ${
        selected ? "border-cyan/70 shadow-node" : "border-line hover:border-ink-faint/50"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${accent.iconWrap}`}>
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
          className="nodrag shrink-0 rounded p-1 text-ink-faint hover:bg-raised hover:text-rose-700"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <span
        className={`mt-3 inline-block rounded px-2 py-1 font-mono text-[10px] ${accent.chip}`}
      >
        {entry.service}
      </span>

      {summaryValue !== undefined ? (
        <p className="mt-2 truncate rounded-lg border border-line bg-canvas/70 px-2.5 py-2 font-mono text-[11px] text-ink-soft">
          {entry.summaryKey}: {String(summaryValue)}
        </p>
      ) : null}
    </div>
  );
}