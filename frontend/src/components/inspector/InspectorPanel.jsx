import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ChevronDown,
  ChevronUp,
  PanelRightClose,
  SlidersHorizontal,
} from "lucide-react";

import { inspectorTabState, selectedNodeState } from "../../state/atoms.js";

import Panel from "../ui/Panel.jsx";
import ConfigTab from "./ConfigTab.jsx";
import PayloadTab from "./tabs/PayloadTab.jsx";
import LogsTab from "./tabs/LogsTab.jsx";

const outputTabs = [
  { id: "payload", label: "Backend payload" },
  { id: "logs", label: "Execution logs" },
];

export default function InspectorPanel({ onClose }) {
  const node = useRecoilValue(selectedNodeState);
  const activeTab = useRecoilValue(inspectorTabState);
  const setActiveTab = useSetRecoilState(inspectorTabState);

  const [isOutputOpen, setIsOutputOpen] = useState(false);

  return (
    <Panel
      title="Step settings"
      action={
        node ? (
          <span className="font-mono text-[10px] text-ink-faint">
            {node.id}
          </span>
        ) : null
      }
      onClose={onClose}
      closeIcon={<PanelRightClose size={15} />}
      className="w-[270px] shrink-0 border-l border-line"
      scroll={false}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {!isOutputOpen ? (
          <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
            {node ? (
              <ConfigTab node={node} />
            ) : (
              <div className="grid h-full place-items-center px-5 text-center">
                <div>
                  <SlidersHorizontal
                    size={24}
                    className="mx-auto text-ink-faint"
                  />

                  <p className="mt-3 text-sm text-ink-soft">No step selected</p>

                  <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                    Select a workflow step to edit its configuration.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 border-b border-line">
              {outputTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 border-b-2 px-2 py-2.5 text-[10px] font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "border-cyan text-cyan"
                      : "border-transparent text-ink-faint hover:text-ink-soft"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsOutputOpen(false)}
                aria-label="Collapse output"
                className="flex w-8 items-center justify-center text-ink-faint hover:text-ink"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {activeTab === "payload" ? <PayloadTab /> : null}
              {activeTab === "logs" ? <LogsTab /> : null}
            </div>
          </div>
        )}

        {!isOutputOpen ? (
          <button
            type="button"
            onClick={() => setIsOutputOpen(true)}
            className="flex h-10 shrink-0 items-center justify-between border-t border-line px-3 text-ink-faint hover:text-ink-soft"
          >
            <span className="text-xs font-semibold">Workflow output</span>
            <ChevronUp size={14} />
          </button>
        ) : null}
      </div>
    </Panel>
  );
}
