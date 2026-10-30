import { ArrowLeft, LayoutDashboard, Loader2, Play, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { workflowMetaState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import { useDeploy } from "../../state/useDeploy.js";
import UserMenu from "../auth/UserMenu.jsx";
import { primaryButton } from "../ui/Button.jsx";

const actionButton =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function TopBar() {
  const navigate = useNavigate();
  const meta = useRecoilValue(workflowMetaState);
  const { renameWorkflow } = useWorkflow();
  const { status, deploy, simulate } = useDeploy();

  const deploying = status.phase === "deploying";
  const simulating = status.phase === "simulating";

  return (
    <header className="relative z-40 flex h-[72px] shrink-0 items-center justify-between gap-5 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Back to dashboard"
          onClick={() => navigate("/dashboard")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <input
              aria-label="Workflow name"
              value={meta.name}
              onChange={(event) => renameWorkflow(event.target.value)}
              className="w-[18ch] truncate rounded-lg border border-transparent bg-gray-200 px-2 py-1 text-base font-semibold tracking-tight text-slate-950 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 md:inline-flex"
        >
          <LayoutDashboard size={15} />
          Dashboard
        </button>

        <button
          type="button"
          onClick={simulate}
          disabled={deploying || simulating}
          className={`${actionButton} border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700`}
        >
          {simulating ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Play size={15} />
          )}
          <span className="hidden sm:inline">
            {simulating ? "Testing..." : "Test"}
          </span>
        </button>

        <button
          type="button"
          onClick={deploy}
          disabled={deploying}
          className={primaryButton}
        >
          {deploying ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          <span className="hidden sm:inline">
            {deploying ? "Publishing..." : "Publish"}
          </span>
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
