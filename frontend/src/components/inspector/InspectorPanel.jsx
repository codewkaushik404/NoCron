import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { PanelRightClose, SlidersHorizontal } from "lucide-react";
import { selectedNodeState, inspectorTabState } from "../../state/atoms.js";
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

/**
 * Top: the selected node's own fields (ConfigTab), capped to ~40% of the
 * panel height. Bottom: workflow-level output — the deploy payload, the
 * generated state machine, execution logs — which stays visible whether or
 * not a node is selected, since it describes the whole graph.
 */
export default function InspectorPanel({ onClose }) {
  const node = useRecoilValue(selectedNodeState);
  const activeTab = useRecoilValue(inspectorTabState);
  const setActiveTab = useSetRecoilState(inspectorTabState);
  const splitRegionRef = useRef(null);
  const [configHeight, setConfigHeight] = useState(42);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return undefined;

    const handlePointerMove = (event) => {
      const region = splitRegionRef.current;
      if (!region) return;
      const bounds = region.getBoundingClientRect();
      const nextHeight = ((event.clientY - bounds.top) / bounds.height) * 100;
      setConfigHeight(Math.min(72, Math.max(20, nextHeight)));
    };
    const stopResizing = () => setIsResizing(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
    };
  }, [isResizing]);

  const handleResizeKeyDown = (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const direction = event.key === "ArrowUp" ? -1 : 1;
    setConfigHeight((height) => Math.min(72, Math.max(20, height + direction * 3)));
  };

  return (
    <Panel
      title="Node configuration"
      action={
        node ? <span className="font-mono text-[11px] text-ink-faint">ID: {node.id}</span> : null
      }
      onClose={onClose}
      closeIcon={<PanelRightClose size={16} />}
      className="w-[360px] shrink-0 border-l border-line"
      scroll={false}
    >
      <div ref={splitRegionRef} className="flex min-h-0 flex-1 flex-col">
      <div
        style={{ flexBasis: `${configHeight}%` }}
        className="thin-scroll min-h-0 shrink-0 overflow-y-auto border-b border-line"
      >
        {node ? (
          <ConfigTab node={node} />
        ) : (
          <div className="grid place-items-center px-8 py-10 text-center">
            <div>
              <SlidersHorizontal size={26} className="mx-auto text-ink-faint" />
              <p className="mt-3 text-sm text-ink-soft">No block selected</p>
              <p className="mt-1 text-xs text-ink-faint">
                Select a block on the canvas to edit its settings.
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        role="separator"
        aria-label="Resize node configuration and output panels"
        aria-orientation="horizontal"
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsResizing(true);
        }}
        onKeyDown={handleResizeKeyDown}
        className="group relative z-10 h-2 shrink-0 cursor-row-resize border-b border-line bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan"
      >
        <span className="absolute left-1/2 top-1/2 h-0.5 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-line transition-colors group-hover:bg-cyan group-focus:bg-cyan" />
      </div>

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
      </div>

      <div className="min-h-0 flex-1">
        {activeTab === "payload" ? <PayloadTab /> : null}
        {activeTab === "stateMachine" ? <StepFunctionsTab /> : null}
        {activeTab === "logs" ? <LogsTab /> : null}
      </div>
      </div>
    </Panel>
  );
}