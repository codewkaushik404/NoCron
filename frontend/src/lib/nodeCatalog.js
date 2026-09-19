import { Clock, Webhook, GitBranch, Timer, Mail, MessageSquare } from "lucide-react";

/**
 * Single source of truth for every block a user can place on the canvas.
 *
 * Each entry owns its icon, accent, AWS service label, and the default `data`
 * payload cloned onto a new node. The library sidebar, the canvas node renderer
 * (Phase 2) and the inspector form all read from here, so adding a new block
 * type stays a one-file change.
 */

export const NODE_KIND = {
  TRIGGER: "trigger",
  LOGIC: "logic",
  ACTION: "action",
};

export const nodeCatalog = [
  {
    type: "scheduleTrigger",
    kind: NODE_KIND.TRIGGER,
    label: "Schedule Trigger",
    service: "AWS EventBridge Scheduler",
    icon: Clock,
    accent: "cyan",
    summaryKey: "expression",
    defaults: {
      name: "Every Morning",
      expression: "cron(0 9 * * ? *)",
      timezone: "UTC",
    },
  },
  {
    type: "webhookTrigger",
    kind: NODE_KIND.TRIGGER,
    label: "Incoming Webhook",
    service: "AWS API Gateway",
    icon: Webhook,
    accent: "cyan",
    summaryKey: "path",
    defaults: {
      name: "User Signup Webhook",
      path: "/v1/user-signup",
      method: "POST",
      auth: "API Key",
    },
  },
  {
    type: "branch",
    kind: NODE_KIND.LOGIC,
    label: "IF / ELSE Branch",
    service: "AWS Step Functions (Choice)",
    icon: GitBranch,
    accent: "violet",
    summaryKey: "variable",
    defaults: {
      name: "Is Pro Customer?",
      variable: "$.payload.user.isPro",
      operator: "equals",
      value: "true",
    },
  },
  {
    type: "wait",
    kind: NODE_KIND.LOGIC,
    label: "Wait / Delay",
    service: "AWS Step Functions (Wait)",
    icon: Timer,
    accent: "violet",
    summaryKey: "seconds",
    defaults: { name: "Hold 5 Minutes", seconds: 300 },
  },
  {
    type: "sendEmail",
    kind: NODE_KIND.ACTION,
    label: "Send Email (SES)",
    service: "AWS SES (Simple Email)",
    icon: Mail,
    accent: "amber",
    summaryKey: "recipient",
    defaults: {
      name: "Send VIP Onboarding",
      recipient: "$.payload.user.email",
      subject: "Welcome aboard",
      body: "",
    },
  },
  {
    type: "slackNotify",
    kind: NODE_KIND.ACTION,
    label: "Slack Notification",
    service: "AWS Lambda + Slack API",
    icon: MessageSquare,
    accent: "amber",
    summaryKey: "channel",
    defaults: {
      name: "Ping #sales-leads",
      channel: "#sales-leads",
      message: "New signup: $.payload.user.email",
    },
  },
];

export const catalogByType = Object.fromEntries(
  nodeCatalog.map((entry) => [entry.type, entry])
);

export const librarySections = [
  { kind: NODE_KIND.TRIGGER, title: "Triggers" },
  { kind: NODE_KIND.LOGIC, title: "Logic & Control" },
  { kind: NODE_KIND.ACTION, title: "Actions" },
];

/** Tailwind classes per accent, kept out of components so cards stay dumb. */
export const accentStyles = {
  cyan: {
    iconWrap: "bg-cyan/10 text-cyan ring-1 ring-cyan/30",
    border: "hover:border-cyan/50",
    chip: "bg-cyan/10 text-cyan",
  },
  violet: {
    iconWrap: "bg-violet/10 text-violet ring-1 ring-violet/30",
    border: "hover:border-violet/50",
    chip: "bg-violet/10 text-violet",
  },
  amber: {
    iconWrap: "bg-amber/10 text-amber ring-1 ring-amber/30",
    border: "hover:border-amber/50",
    chip: "bg-amber/10 text-amber",
  },
};
