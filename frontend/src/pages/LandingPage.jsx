import { useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  Github,
  Workflow,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import {
  nodeCatalog,
  accentStyles,
  librarySections,
} from "../lib/nodeCatalog.js";
import { useAuth } from "../state/useAuth.js";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import Button from "../components/ui/Button.jsx";

const REPO_URL = "https://github.com/codewkaushik404/NoCron";

const steps = [
  {
    icon: Workflow,
    title: "Build it visually",
    body: "Drag triggers, logic and actions onto a canvas and connect them - no cron syntax, no orchestration code.",
  },
  {
    icon: Rocket,
    title: "Deploy in one click",
    body: "The graph is validated, turned into a Step Functions definition, and stood up on AWS for you.",
  },
  {
    icon: ShieldCheck,
    title: "It just runs",
    body: "Webhooks, schedules and Tally forms trigger real executions - watch them in the test logs as they happen.",
  },
];

/** Public marketing page at "/". Shares nodeCatalog.js with the app itself, so the block grid never drifts out of sync with what's actually buildable. */
export default function LandingPage() {
  const navigate = useNavigate();
  const { status } = useAuth();
  const authenticated = status === "authenticated";

  return (
    <div className="min-h-screen bg-canvas">
      <nav className="sticky top-0 z-20 border-b border-line bg-panel/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan bg-cyan/80 text-white">
              <Zap size={16} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold text-ink">No-Cron</span>
          </div>

          <div className="flex items-center gap-4">
            {authenticated ? (
              <Button
                variant="primary"
                icon={ArrowRight}
                onClick={() => navigate("/app")}
              >
                Open workspace
              </Button>
            ) : (
              <GoogleSignInButton
                size="medium"
                onSuccess={() => navigate("/app")}
              />
            )}
          </div>
        </div>
      </nav>

      <header className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mx-auto mb-5 inline-block rounded-full border border-line bg-raised/60 px-3 py-1 font-semibold text-sm text-ink-soft">
          Visual workflow automation for small teams and non-technical users
        </p>
        <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Stop writing cron jobs.
          <br />
          <span className="text-cyan">Draw your automation instead.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
          No-Cron turns triggers, logic and actions into a real AWS Step
          Functions workflow connect a webhook or schedule to an email, a
          Slack ping, Discord messages or a conditional branch, without touching the AWS console.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {authenticated ? (
            <Button
              variant="primary"
              icon={ArrowRight}
              onClick={() => navigate("/app")}
            >
              Open your workspace
            </Button>
          ) : (
            <GoogleSignInButton onSuccess={() => navigate("/app")} />
          )}
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-line bg-panel p-5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan/10 text-cyan ring-1 ring-cyan/30">
                <step.icon size={17} strokeWidth={2} />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/60 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-ink">
            Every block you can drop on the canvas
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-soft">
            Pulled straight from the workflow editor's own block library - this
            list updates itself as new blocks ship.
          </p>

          <div className="mt-10 space-y-8">
            {librarySections.map((section) => (
              <div key={section.kind}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {section.title}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {nodeCatalog
                    .filter((entry) => entry.kind === section.kind)
                    .map((entry) => {
                      const accent = accentStyles[entry.accent];
                      const Icon = entry.icon;
                      return (
                        <div
                          key={entry.type}
                          className="flex items-center gap-3 rounded-xl border border-line bg-panel px-3.5 py-3"
                        >
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accent.iconWrap}`}
                          >
                            <Icon size={16} strokeWidth={2} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {entry.label}
                            </p>
                            {entry.service ? (
                              <p className="truncate font-mono text-[11px] text-ink-faint">
                                {entry.service}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
