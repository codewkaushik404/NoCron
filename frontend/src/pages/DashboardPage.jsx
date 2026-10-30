import { useEffect, useState } from "react";
import { ArrowRight, Plus, RefreshCw, Workflow, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/apiBase.js";
import { useAuth } from "../state/useAuth.js";
import Nav from "../components/topbar/Navbar.jsx";
import { primaryButton } from "../components/ui/Button.jsx";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWorkflows() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/v1/workflows"), {
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Unable to load workflows.");
      }

      setWorkflows(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load workflows.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkflows();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <Nav />

      <main
        className="min-h-[calc(100vh-72px)] px-6 py-12"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.16) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Your workflows
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Build and manage your linear webhook automations.
              </p>
            </div>

            <button
              type="button"
              onClick={loadWorkflows}
              disabled={loading}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-8 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <p>{error}</p>
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError("")}
                className="shrink-0 rounded-md p-1 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white/80"
                />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <EmptyDashboard onCreate={() => navigate("/app")} />
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onOpen={() => navigate(`/app/${workflow.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyDashboard({ onCreate }) {
  return (
    <section className="flex min-h-[560px] flex-col items-center justify-center text-center">
      <EmptyWorkflowIllustration />

      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">
        No workflows yet
      </h2>

      <p className="my-4 max-w-md text-sm leading-6 text-slate-500">
        Start with a webhook trigger and connect your first action.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className={primaryButton}
      >
        <Plus size={17} />
        Create your first workflow
      </button>
    </section>
  );
}

function EmptyWorkflowIllustration() {
  return (
    <svg
      width="260"
      height="180"
      viewBox="0 0 260 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="38"
        y="20"
        width="184"
        height="140"
        rx="24"
        fill="white"
        fillOpacity="0.8"
        stroke="#CBD5E1"
      />

      <rect
        x="72"
        y="48"
        width="116"
        height="38"
        rx="12"
        fill="#EEF2FF"
        stroke="#C7D2FE"
      />

      <circle cx="92" cy="67" r="7" fill="#6366F1" />
      <path d="M108 67H166" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

      <path
        d="M130 86V110"
        stroke="#94A3B8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />

      <rect
        x="72"
        y="110"
        width="116"
        height="24"
        rx="9"
        fill="#F8FAFC"
        stroke="#CBD5E1"
      />

      <path
        d="M98 122H162"
        stroke="#CBD5E1"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle cx="28" cy="54" r="4" fill="#CBD5E1" />
      <circle cx="232" cy="126" r="4" fill="#CBD5E1" />
      <circle cx="52" cy="145" r="3" fill="#A5B4FC" />
      <circle cx="210" cy="42" r="3" fill="#A5B4FC" />
    </svg>
  );
}

function WorkflowCard({ workflow, onOpen }) {
  const updatedAt = workflow.updated_at
    ? new Date(workflow.updated_at).toLocaleDateString()
    : "Unknown";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-900/10"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <Workflow size={19} />
        </span>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          {workflow.status ?? "DRAFT"}
        </span>
      </div>

      <h2 className="mt-5 truncate font-semibold text-slate-950">
        {workflow.name}
      </h2>

      <p className="mt-2 text-xs text-slate-400">
        Updated {updatedAt}
      </p>

      <p className="mt-6 text-sm font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
        Open workflow {"->"}
      </p>
    </button>
  );
}