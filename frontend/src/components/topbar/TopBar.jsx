import { Zap, Play, Send, Loader2 } from "lucide-react";
import { useRecoilValue } from "recoil";
import { workflowMetaState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import { useDeploy } from "../../state/useDeploy.js";
import Button from "../ui/Button.jsx";

export default function TopBar() {
  const meta = useRecoilValue(workflowMetaState);
  const { renameWorkflow } = useWorkflow();
  const { status, deploy } = useDeploy();
  const deploying = status.phase === "deploying";

  return (
    <header className="flex shrink-0 items-center justify-between gap-6 border-b border-line bg-panel px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet to-cyan text-white shadow-glow">
          <Zap size={22} strokeWidth={2.5} />
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <input
              aria-label="Workflow name"
              value={meta.name}
              onChange={(event) => renameWorkflow(event.target.value)}
              className="w-[22ch] truncate rounded bg-transparent text-xl font-bold text-cyan outline-none hover:bg-raised/60 focus:bg-raised/60 sm:w-[30ch]"
            />
            <span className="rounded bg-raised px-2 py-0.5 font-mono text-[10px] text-ink-soft">
              aws serverless
            </span>
          </div>
          <p className="text-xs text-ink-faint">
            Event-driven and time-based visual workflow engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button icon={Play}>Simulate run</Button>
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