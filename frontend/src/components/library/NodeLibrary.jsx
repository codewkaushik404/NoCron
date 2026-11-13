import { Layers, PanelLeftClose } from "lucide-react";
import { useRecoilValue } from "recoil";

import { librarySections } from "../../lib/nodeCatalog.js";
import { nodeCatalogState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import Panel from "../ui/Panel.jsx";
import LibraryCard from "./LibraryCard.jsx";

export default function NodeLibrary({ onClose }) {
  const { addNode } = useWorkflow();
  const catalog = useRecoilValue(nodeCatalogState);
  const hasTrigger = catalog.entries.some(
    (entry) => entry.kind === "trigger",
  );
  const hasAction = catalog.entries.some((entry) => entry.kind === "action");

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
          {catalog.status === "ready" && (!hasTrigger || !hasAction) ? (
            <div
              role="status"
              className="rounded-xl border border-dashed border-line px-3 py-4 text-center"
            >
              <p className="text-sm font-semibold text-ink">
                {!hasTrigger && !hasAction
                  ? "No workflow blocks available"
                  : `No ${!hasTrigger ? "triggers" : "actions"} available`}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                At least one trigger and one action are required to build a
                workflow.
              </p>
            </div>
          ) : null}
          {catalog.status === "loading" ? (
            <p role="status" className="text-xs text-ink-faint">
              Loading workflow blocks…
            </p>
          ) : null}
          {catalog.status === "error" ? (
            <p role="alert" className="text-xs text-rose-600">
              {catalog.error}
            </p>
          ) : null}
          {librarySections.map((section) => {
            const entries = catalog.entries.filter(
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
                      key={entry.id}
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
