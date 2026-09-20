import { useRecoilValue, useSetRecoilState } from "recoil";
import { useState } from "react";
import {
  PanelRightClose,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  selectedNodeState,
  inspectorTabState,
} from "../../state/atoms.js";

import Panel from "../ui/Panel.jsx";
import ConfigTab from "./ConfigTab.jsx";
import PayloadTab from "./tabs/PayloadTab.jsx";
import StepFunctionsTab from "./tabs/StepFunctionsTab.jsx";
import LogsTab from "./tabs/LogsTab.jsx";

const outputTabs = [
  { id: "payload", label: "Backend Payload" },
  { id: "stateMachine", label: "AWS Step Functions JSON" },
  { id: "logs", label: "Test Logs" },
];

export default function InspectorPanel({ onClose }) {
  const node = useRecoilValue(selectedNodeState);
  const activeTab = useRecoilValue(inspectorTabState);
  const setActiveTab = useSetRecoilState(inspectorTabState);

  const [isOutputOpen, setIsOutputOpen] = useState(false);

  return (
    <Panel
      title="Node configuration"
      action={
        node ? (
          <span className="font-mono text-[11px] text-ink-faint">
            ID: {node.id}
          </span>
        ) : null
      }
      onClose={onClose}
      closeIcon={<PanelRightClose size={16} />}
      className="w-[360px] shrink-0 border-l border-line"
      scroll={false}
    >
      <div className="flex min-h-0 flex-1 flex-col">

        {/* NODE CONFIGURATION */}
        {!isOutputOpen && (
          <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
            {node ? (
              <ConfigTab node={node} />
            ) : (
              <div className="grid h-full place-items-center px-8 text-center">
                <div>
                  <SlidersHorizontal
                    size={26}
                    className="mx-auto text-ink-faint"
                  />

                  <p className="mt-3 text-sm text-ink-soft">
                    No block selected
                  </p>

                  <p className="mt-1 text-xs text-ink-faint">
                    Select a block on the canvas to edit its settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* OUTPUT COLLAPSED BAR */}
        {!isOutputOpen && (
          <button
            type="button"
            onClick={() => setIsOutputOpen(true)}
            className="flex h-10 shrink-0 items-center justify-between border-t border-line px-3 text-ink-faint hover:text-ink-soft"
          >
            <span className="text-[11px] font-semibold">
              Output
            </span>

            <ChevronUp size={15} />
          </button>
        )}

        {/* OUTPUT EXPANDED */}
        {isOutputOpen && (
          <div className="flex min-h-0 flex-1 flex-col">

            {/* Tabs */}
            <div className="flex shrink-0 border-b border-line">
              {outputTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 border-b-2 px-2 py-2.5 text-center text-[11px] font-semibold leading-tight transition-colors ${
                    activeTab === tab.id
                      ? "border-cyan text-cyan"
                      : "border-transparent text-ink-faint hover:text-ink-soft"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Collapse output */}
              <button
                type="button"
                onClick={() => setIsOutputOpen(false)}
                className="flex w-8 shrink-0 items-center justify-center text-ink-faint hover:text-ink-soft"
                title="Collapse output"
              >
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {activeTab === "payload" && <PayloadTab />}

              {activeTab === "stateMachine" && (
                <StepFunctionsTab />
              )}

              {activeTab === "logs" && <LogsTab />}
            </div>

          </div>
        )}
      </div>
    </Panel>
  );
}