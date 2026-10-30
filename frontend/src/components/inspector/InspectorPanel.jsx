import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ChevronDown,
  ChevronUp,
  PanelRightClose,
  SlidersHorizontal,
  ScrollText,
} from "lucide-react";

import { inspectorTabState, selectedNodeState } from "../../state/atoms.js";
import { catalogByType } from "../../lib/nodeCatalog.js";
import Panel from "../ui/Panel.jsx";
import ConfigTab from "./ConfigTab.jsx";
import PayloadTab from "./tabs/PayloadTab.jsx";
import LogsTab from "./tabs/LogsTab.jsx";

const outputTabs = [{ id: "logs", label: "Execution logs" }];

export default function InspectorPanel({ onClose }) {
  const node = useRecoilValue(selectedNodeState);
  const activeTab = useRecoilValue(inspectorTabState);
  const setActiveTab = useSetRecoilState(inspectorTabState);

  const [isOutputOpen, setIsOutputOpen] = useState(true);

  return (
    <Panel
      title={isOutputOpen ? "Execution logs" : "Settings"}
      action={null}
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

                  <p className="mt-3 text-sm text-ink-soft">No Node selected</p>

                  <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                    Select a workflow node to edit its configuration.
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
            onClick={() => {
              setActiveTab("logs");
              setIsOutputOpen(true);
            }}
            className="flex shrink-0 items-center gap-3 border-t border-line px-3 py-3 text-left text-ink-faint transition hover:bg-raised/50 hover:text-ink-soft"
          >
            <ScrollText size={16} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-ink-soft">
                Execution logs
              </span>
              <span className="mt-0.5 block text-[10px] leading-relaxed text-ink-faint">
                View workflow runs and their statuses
              </span>
            </span>
            <ChevronUp size={14} />
          </button>
        ) : null}
      </div>
    </Panel>
  );
}
