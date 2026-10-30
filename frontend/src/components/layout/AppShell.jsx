import { useEffect, useState } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useParams } from "react-router-dom";

import TopBar from "../topbar/TopBar.jsx";
import DeployBanner from "../topbar/DeployBanner.jsx";
import NodeLibrary from "../library/NodeLibrary.jsx";
import CanvasSurface from "../canvas/CanvasSurface.jsx";
import InspectorPanel from "../inspector/InspectorPanel.jsx";
import StatusBar from "./StatusBar.jsx";
import { useWorkflow } from "../../state/useWorkflow.js";

export default function AppShell() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const { workflowId } = useParams();
  const { loadWorkflowById } = useWorkflow();

  useEffect(() => {
    if (workflowId) {
      loadWorkflowById(workflowId);
    }
  }, [workflowId, loadWorkflowById]);

  return (
    <div className="app-shell flex h-screen flex-col overflow-hidden bg-[#f7f8fa] text-slate-950">
      <TopBar />
      <DeployBanner />

      <div className="flex min-h-0 flex-1">
        {leftOpen ? (
          <NodeLibrary onClose={() => setLeftOpen(false)} />
        ) : (
          <button
            type="button"
            aria-label="Open components panel"
            onClick={() => setLeftOpen(true)}
            className="absolute left-4 top-[88px] z-30 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <PanelLeftOpen size={17} />
          </button>
        )}

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <CanvasSurface />
          <StatusBar />
        </main>

        {rightOpen ? (
          <InspectorPanel onClose={() => setRightOpen(false)} />
        ) : (
          <button
            type="button"
            aria-label="Open inspector panel"
            onClick={() => setRightOpen(true)}
            className="absolute right-4 top-[88px] z-30 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <PanelRightOpen size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
