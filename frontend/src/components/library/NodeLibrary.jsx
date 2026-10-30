import { Layers, PanelLeftClose, Sparkles } from "lucide-react";

import { librarySections, nodeCatalog } from "../../lib/nodeCatalog.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import Panel from "../ui/Panel.jsx";
import LibraryCard from "./LibraryCard.jsx";

export default function NodeLibrary({ onClose }) {
  const { addNode } = useWorkflow();

  return (
    <Panel
      title="Workflow blocks"
      subtitle="Start with a webhook, then add actions in order."
      onClose={onClose}
      closeIcon={<PanelLeftClose size={16} />}
      className="w-[270px] shrink-0 border-r border-slate-200 bg-white"
    >
      <div className="thin-scroll h-full overflow-y-auto">
        <div className="space-y-7 px-4 py-5">
          {librarySections.map((section) => {
            const entries = nodeCatalog.filter(
              (entry) => entry.kind === section.kind,
            );

            return (
              <section key={section.kind}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <Layers size={13} />
                    {section.title}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {entries.map((entry) => (
                    <LibraryCard
                      key={entry.type}
                      entry={entry}
                      onAdd={addNode}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
