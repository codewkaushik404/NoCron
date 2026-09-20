import { useRecoilValue } from "recoil";
import { graphStatsState, workflowMetaState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";

export default function StatusBar() {
  const { nodeCount, edgeCount } = useRecoilValue(graphStatsState);
  const meta = useRecoilValue(workflowMetaState);
  const { toggleActive } = useWorkflow();

  return (
    <footer className="flex shrink-0 items-center justify-between border-t border-line bg-panel px-5 py-2 font-mono text-[11px] text-ink-faint">
      <span>
        Nodes: {nodeCount} | Edges: {edgeCount}
      </span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleActive}
          className="flex items-center gap-2 rounded px-2 py-1 hover:bg-raised"
        >
          <span
            className={`h-2 w-2 rounded-full ${meta.isActive ? "bg-emerald-400" : "bg-ink-faint"}`}
          />
          {meta.isActive ? "Active" : "Inactive"}
        </button>
      </div>
    </footer>
  );
}
