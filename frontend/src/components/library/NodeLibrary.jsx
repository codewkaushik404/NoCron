import { Layers, PanelLeftClose } from "lucide-react";
import { librarySections, nodeCatalog } from "../../lib/nodeCatalog.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import Panel from "../ui/Panel.jsx";
import LibraryCard from "./LibraryCard.jsx";

export default function NodeLibrary({ onClose }) {
  const { addNode } = useWorkflow();

  return (
    <Panel
      title="Workflow components"
      onClose={onClose}
      closeIcon={<PanelLeftClose size={16} />}
      className="w-[290px] shrink-0 border-r border-line"
    >
      <div className="space-y-6 px-4 py-5">
        {librarySections.map((section) => {
          const entries = nodeCatalog.filter((entry) => entry.kind === section.kind);
          return (
            <section key={section.kind}>
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-soft">
                <Layers size={13} className="text-ink-faint" />
                {section.title}
              </h3>
              <div className="space-y-2.5">
                {entries.map((entry) => (
                  <LibraryCard key={entry.type} entry={entry} onAdd={addNode} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Panel>
  );
}
