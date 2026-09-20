import { Zap, Play, Send, Loader2 } from "lucide-react";
import { useRecoilValue } from "recoil";
import { workflowMetaState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import { useDeploy } from "../../state/useDeploy.js";
import Button from "../ui/Button.jsx";

export default function TopBar() {
  const meta = useRecoilValue(workflowMetaState);
  const { renameWorkflow } = useWorkflow();
  const { status, deploy, simulate } = useDeploy();
  const deploying = status.phase === "deploying";
  const simulating = status.phase === "simulating";

  return (
    <header className="flex shrink-0 items-center justify-between gap-6 border-b border-line bg-panel px-5 py-2">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-11 place-items-center rounded-xl border border-cyan bg-cyan/80 text-white">
          <Zap size={22} strokeWidth={2.5} />
        </span> 

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <input
              aria-label="Workflow name"
              value={meta.name}
              onChange={(event) => renameWorkflow(event.target.value)}
              className="w-[22ch] truncate rounded bg-raised/80 text-lg font-bold text-cyan/50 sm:w-[30ch]"
            />
          </div>
          <p className="text-xs text-ink-faint">
            Event-driven and time-based visual workflow engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button icon={simulating ? Loader2 : Play} onClick={simulate} disabled={deploying || simulating}>
          {simulating ? "Simulating…" : "Simulate run"}
        </Button>
        <Button
          variant="primary"
          icon={deploying ? Loader2 : Send}
          onClick={deploy}
          disabled={deploying}
          className={deploying ? "[&_svg]:animate-spin" : ""}
        >
          {deploying ? "Deploying…" : "Deploy workflow"}
        </Button>
      </div>
    </header>
  );
}