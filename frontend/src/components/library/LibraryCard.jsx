import { Plus } from "lucide-react";
import { accentStyles } from "../../lib/nodeCatalog.js";

/**
 * One draggable block in the left library. Phase 1 wires the click-to-add path;
 * the dragstart payload is already set so Phase 2's canvas drop handler works
 * without touching this file.
 */
export default function LibraryCard({ entry, onAdd }) {
  const Icon = entry.icon;
  const accent = accentStyles[entry.accent];

  const handleDragStart = (event) => {
    event.dataTransfer.setData("application/nocron-node", entry.type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onAdd(entry.type)}
      className={`group flex w-full items-center gap-3 rounded-xl border border-line bg-raised/50 px-3 py-3 text-left transition-colors ${accent.border} hover:bg-raised`}
    >
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accent.iconWrap}`}>
        <Icon size={17} strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">
          {entry.label}
        </span>
        <span className="block truncate font-mono text-[11px] text-ink-faint">
          {entry.service}
        </span>
      </span>

      <Plus
        size={16}
        className="shrink-0 text-ink-faint transition-colors group-hover:text-cyan"
      />
    </button>
  );
}
