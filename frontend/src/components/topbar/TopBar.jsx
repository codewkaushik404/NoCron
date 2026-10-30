import { LayoutDashboard, Zap, Play, Send, Loader2 } from "lucide-react";
import { useRecoilValue } from "recoil";
import { workflowMetaState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import { useDeploy } from "../../state/useDeploy.js";
import Button from "../ui/Button.jsx";
import UserMenu from "../auth/UserMenu.jsx";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const meta = useRecoilValue(workflowMetaState);
  const { renameWorkflow } = useWorkflow();
  const { status, deploy, simulate } = useDeploy();
  const deploying = status.phase === "deploying";
  const simulating = status.phase === "simulating";
  const navigate = useNavigate();

  return (
    <header className="flex shrink-0 items-center justify-between gap-6 border-b border-line bg-panel px-5 py-2">
      <div className="flex items-center gap-3">
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <input
              aria-label="Workflow name"
              value={meta.name}
              onChange={(event) => renameWorkflow(event.target.value)}
              className="w-[22ch] truncate rounded bg-raised/80 text-lg font-bold text-ink sm:w-[30ch]"
            />
          </div>

          <p className="text-xs text-ink-faint">
            Linear webhook automations for email, Slack, Discord, and delays
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-raised/60 px-3 py-2 text-sm text-ink-soft hover:border-teal/50 hover:text-ink"
        >
          <LayoutDashboard size={15} />
          Dashboard
        </button>
        
        <Button
          icon={simulating ? Loader2 : Play}
          onClick={simulate}
          disabled={deploying || simulating}
        >
          {simulating ? "Simulating…" : "Simulate"}
        </Button>
        <Button
          variant="primary"
          icon={deploying ? Loader2 : Send}
          onClick={deploy}
          disabled={deploying}
          className={deploying ? "[&_svg]:animate-spin" : ""}
        >
          {deploying ? "Publishing..." : "Publish"}
        </Button>
        
        <UserMenu />
      </div>
    </header>
  );
}
