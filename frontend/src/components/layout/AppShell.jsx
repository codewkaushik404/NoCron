import { useState } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import TopBar from "../topbar/TopBar.jsx";
import DeployBanner from "../topbar/DeployBanner.jsx";
import NodeLibrary from "../library/NodeLibrary.jsx";
import CanvasSurface from "../canvas/CanvasSurface.jsx";
import InspectorPanel from "../inspector/InspectorPanel.jsx";
import StatusBar from "./StatusBar.jsx";

export default function AppShell() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="app-shell flex h-screen flex-col overflow-hidden bg-canvas">
      <TopBar />
      <DeployBanner />

      <div className="flex min-h-0 flex-1">
        {leftOpen ? <NodeLibrary onClose={() => setLeftOpen(false)} /> : null}

        <main className="relative flex min-w-0 flex-1 flex-col">
          {!leftOpen ? (
            <button
              type="button"
              aria-label="Open components panel"
              onClick={() => setLeftOpen(true)}
              className="absolute left-3 top-3 z-20 rounded-md border border-line bg-panel p-2 text-ink-soft shadow-panel hover:text-cyan"
            >
              <PanelLeftOpen size={15} />
            </button>
          ) : null}

          <CanvasSurface />
          <StatusBar />
        </main>

        {rightOpen ? (
          <InspectorPanel onClose={() => setRightOpen(false)} />
        ) : null}

        {!rightOpen ? (
          <button
            type="button"
            aria-label="Open inspector panel"
            onClick={() => setRightOpen(true)}
            className="self-start rounded-md border border-line bg-panel p-2 text-ink-soft shadow-panel hover:text-cyan"
          >
            <PanelRightOpen size={15} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
