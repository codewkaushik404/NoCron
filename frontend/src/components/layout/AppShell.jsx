import { useEffect, useState } from "react";
import { LoaderCircle, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import TopBar from "../topbar/TopBar.jsx";
import DeployBanner from "../topbar/DeployBanner.jsx";
import NodeLibrary from "../library/NodeLibrary.jsx";
import CanvasSurface from "../canvas/CanvasSurface.jsx";
import InspectorPanel from "../inspector/InspectorPanel.jsx";
import StatusBar from "./StatusBar.jsx";
import { useWorkflow } from "../../state/useWorkflow.js";
import { nodeCatalogState, workflowLoadState } from "../../state/atoms.js";
import { createNodeCatalog } from "../../lib/nodeCatalog.js";
import { apiUrl } from "../../lib/apiBase.js";

async function fetchAvailableNodes(path, label) {
  const response = await fetch(apiUrl(path), { credentials: "include" });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || `Unable to load available ${label}.`);
  }

  if (result?.data === null) return [];
  if (!Array.isArray(result?.data)) {
    throw new Error(`The available ${label} response has an invalid format.`);
  }

  return result.data;
}

export default function AppShell() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const { workflowId } = useParams();
  const { loadWorkflowById } = useWorkflow();
  const setNodeCatalog = useSetRecoilState(nodeCatalogState);
  const workflowLoad = useRecoilValue(workflowLoadState);

  useEffect(() => {
    let cancelled = false;
    setNodeCatalog({ status: "loading", entries: [], error: null });

    async function loadNodeCatalog() {
      try {
        const [triggers, actions] = await Promise.all([
          fetchAvailableNodes("/api/v1/triggers/available", "triggers"),
          fetchAvailableNodes("/api/v1/actions/available", "actions"),
        ]);

        if (!cancelled) {
          setNodeCatalog({
            status: "ready",
            entries: createNodeCatalog(triggers, actions),
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setNodeCatalog({
            status: "error",
            entries: [],
            error:
              error instanceof Error
                ? error.message
                : "Unable to load workflow blocks.",
          });
        }
      }
    }

    void loadNodeCatalog();
    return () => {
      cancelled = true;
    };
  }, [setNodeCatalog]);

  useEffect(() => {
    if (workflowId) {
      loadWorkflowById(workflowId);
    }
  }, [workflowId, loadWorkflowById]);

  return (
    <div className="app-shell flex h-screen flex-col overflow-hidden bg-[#f7f8fa] text-slate-950">
      <TopBar />

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
          <DeployBanner />

          <CanvasSurface />

          {workflowId && workflowLoad === "loading" ? (
            <div className="absolute inset-0 z-30 grid place-items-center bg-white/75 backdrop-blur-[2px]">
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-xl shadow-slate-900/10"
              >
                <LoaderCircle
                  size={18}
                  className="animate-spin text-indigo-600"
                />
                Loading workflow…
              </div>
            </div>
          ) : null}

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
