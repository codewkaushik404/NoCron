import { useRecoilValue } from "recoil";
import { graphStatsState, workflowMetaState } from "../../state/atoms.js";

export default function StatusBar() {
  const { nodeCount, edgeCount } = useRecoilValue(graphStatsState);

  const meta = useRecoilValue(workflowMetaState);

  const status = meta.status ?? "DRAFT";

  return (
    <footer className="flex shrink-0 items-center justify-between border-t border-line bg-panel px-4 py-2 text-[11px] text-ink-faint">
      <span className="font-mono">
        {nodeCount} steps · {edgeCount} connections
      </span>

      <span
        className={`rounded-full px-2.5 py-1 font-medium uppercase tracking-wide ${
          status === "ACTIVE"
            ? "bg-emerald-500/10 text-emerald-700"
            : "bg-raised text-ink-soft"
        }`}
      >
        {status}
      </span>
    </footer>
  );
}
