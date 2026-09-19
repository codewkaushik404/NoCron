import { ScrollText } from "lucide-react";
import { useRecoilValue } from "recoil";
import { workflowMetaState } from "../../../state/atoms.js";

/**
 * No backend is wired up yet, so this stays an honest empty state rather
 * than fabricated run history. Once `GET /api/workflows/:id/logs` exists,
 * swap this for a fetch + a list of timestamp / status badge / payload rows.
 */
export default function LogsTab() {
  const meta = useRecoilValue(workflowMetaState);

  return (
    <div className="grid h-full place-items-center px-8 text-center">
      <div>
        <ScrollText size={26} className="mx-auto text-ink-faint" />
        <p className="mt-3 text-sm text-ink-soft">
          {meta.active ? "No executions yet" : "Workflow isn't deployed"}
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          {meta.active
            ? "Runs will show up here with their status and payload as they happen."
            : "Deploy the workflow to start collecting execution logs."}
        </p>
      </div>
    </div>
  );
}
