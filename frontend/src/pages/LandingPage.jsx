import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Check,
  Hash,
  ListOrdered,
  Mail,
  MessageCircle,
  RefreshCw,
  Timer,
  Webhook,
} from "lucide-react";

import { useAuth } from "../state/useAuth.js";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import Nav, { Logo } from "../components/topbar/Navbar.jsx";
import { primaryButton } from "../components/ui/Button.jsx";

const blocks = [
  {
    icon: Webhook,
    kind: "Trigger",
    label: "Webhook",
    body: "Start a workflow whenever an HTTP POST request reaches your unique URL.",
  },
  {
    icon: Mail,
    kind: "Action",
    label: "Send Email",
    body: "Send a formatted email to any address.",
  },
  {
    icon: MessageCircle,
    kind: "Action",
    label: "Send Discord Message",
    body: "Post a message to a Discord channel through a webhook.",
  },
  {
    icon: Hash,
    kind: "Action",
    label: "Send Slack Message",
    body: "Post a message to a Slack channel through an incoming webhook.",
  },
  {
    icon: Timer,
    kind: "Action",
    label: "Wait",
    body: "Pause the workflow before running the next step.",
  },
];

const steps = [
  {
    title: "Pick a trigger",
    body: "Every workflow starts with a webhook. You get a unique URL when you publish.",
  },
  {
    title: "Stack your actions",
    body: "Add emails, Slack or Discord messages and waits. They run one after another.",
  },
  {
    title: "Publish and call it",
    body: "Send a POST request to your URL. NoCron queues the run and works through each step.",
  },
];

const principles = [
  {
    icon: ListOrdered,
    title: "One line, no branches",
    body: "One trigger followed by actions in order. If you can read top to bottom, you can read your workflow.",
  },
  {
    icon: RefreshCw,
    title: "Retries built in",
    body: "Failed runs are retried automatically before they are marked as failed.",
  },
  {
    icon: Activity,
    title: "Every run is tracked",
    body: "Each trigger creates an execution you can follow from pending to succeeded or failed.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const goDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          />

          <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center sm:pt-28">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              Linear workflow automation
            </p>

            <h1 className="text-[2.4rem] font-bold leading-[1.1] tracking-[-0.035em] text-slate-900 sm:text-6xl lg:text-7xl">
              Automate in{" "}
              <span className="whitespace-nowrap text-slate-400">
                a straight line.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
              One webhook trigger, followed by Email, Slack, Discord and Wait
              actions that run in order. No branching, no cron syntax, no
              servers to babysit.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              {authenticated ? (
                <button
                  type="button"
                  onClick={goDashboard}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Open dashboard
                  <ArrowRight size={16} />
                </button>
              ) : (
                <GoogleSignInButton />
              )}

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
              >
                See how it works
                <ArrowRight size={15} />
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-slate-500">
              {[
                "Sign in with Google",
                "Publish in minutes",
                "Every run tracked",
              ].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Check
                    size={15}
                    className="text-slate-900"
                    strokeWidth={2.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Works with */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6">
            {blocks.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"
              >
                <Icon size={16} />
                {label.replace("Send ", "").replace(" Message", "")}
              </span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="relative isolate overflow-hidden border-y border-slate-200 bg-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                From idea to running in three steps.
              </h2>

              <ol className="mt-10">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative flex gap-5 pb-9 last:pb-0"
                  >
                    {index < steps.length - 1 ? (
                      <span className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-slate-200" />
                    ) : null}

                    <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-900">
                      {index + 1}
                    </span>

                    <div className="pt-1.5">
                      <h3 className="text-base font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Blocks */}
        <section
          id="blocks"
          className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Building blocks
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Small toolbox. Everything you need.
              </h2>

              <p className="mt-3 text-base leading-relaxed text-slate-500">
                One way to start, four things to do next. Mix and repeat them in
                any order.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blocks.map((block) => {
                const Icon = block.icon;

                return (
                  <div
                    key={block.label}
                    className="rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-200 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                        <Icon size={19} />
                      </span>

                      <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                        {block.kind}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      {block.label}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                      {block.body}
                    </p>
                  </div>
                );
              })}

              <div className="flex flex-col justify-center rounded-xl border border-dashed border-slate-300 p-5 text-center">
                <p className="text-sm font-semibold text-slate-900">
                  More coming
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  New blocks plug into the same straight line.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-10 sm:grid-cols-3">
            {principles.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700">
                  <Icon size={18} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative isolate overflow-hidden border-t border-slate-200 bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
          />

          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                Start building today
              </p>

              <h2 className="text-[2.4rem] font-bold leading-[1.1] tracking-[-0.035em] text-slate-900 sm:text-6xl">
                Your next workflow
                <br />
                <span className="text-slate-400">starts here.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-900">
                Sign in with Google and have a live webhook in a couple of
                minutes.
              </p>

              <div className="mt-9 flex justify-center">
                {authenticated ? (
                  <button
                    type="button"
                    onClick={goDashboard}
                    className={primaryButton}
                  >
                    Open dashboard
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <GoogleSignInButton />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-slate-500">
            NoCron. One trigger, then everything in order.
          </p>
        </div>
      </footer>
    </div>
  );
}
