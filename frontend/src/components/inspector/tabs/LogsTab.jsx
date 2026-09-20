import { ScrollText } from "lucide-react";
import { useRecoilValue } from "recoil";
import { executionLogsState, workflowMetaState } from "../../../state/atoms.js";

/**
 * No backend is wired up yet, so this stays an honest empty state rather
 * than fabricated run history. Once `GET /api/workflows/:id/logs` exists,
 * swap this for a fetch + a list of timestamp / status badge / payload rows.
 */
export default function LogsTab() {
  const meta = useRecoilValue(workflowMetaState);
  const logs = useRecoilValue(executionLogsState);

  if (logs.length > 0) {
    return (
      <div className="thin-scroll h-full space-y-2 overflow-y-auto p-4">
        {logs.map((log, index) => (
          <div key={`${log.executionId}-${index}`} className="rounded-lg border border-line bg-raised/40 p-3 text-left">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-ink-faint">{log.executionId}</span>
              <span className="text-[10px] font-semibold uppercase text-emerald-700">{log.status}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">{log.message}</p>
            <time className="mt-1 block font-mono text-[10px] text-ink-faint">
              {new Date(log.timestamp).toLocaleTimeString()}
            </time>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full place-items-center px-8 text-center">
      <div>
        <ScrollText size={26} className="mx-auto text-ink-faint" />
        <p className="mt-3 text-sm text-ink-soft">
          {meta.isActive ? "No executions yet" : "Workflow isn't deployed"}
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          {meta.isActive
            ? "Runs will show up here with their status and payload as they happen."
            : "Deploy the workflow to start collecting execution logs."}
        </p>
      </div>
    </div>
  );
}
