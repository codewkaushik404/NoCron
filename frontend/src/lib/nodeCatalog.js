import { Clock, Webhook, GitBranch, 
  Timer, Mail, MessageSquare, FormInput, Ban 
} from "lucide-react";

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
      name: "Schedule Trigger",
      expression: "cron(0 9 * * ? *)",
      timezone: "Asia/Kolkata",
    },
  },
  {
    type: "webhookTrigger",
    kind: NODE_KIND.TRIGGER,
    label: "Webhook Trigger",
    service: null,
    icon: Webhook,
    accent: "cyan",
    summaryKey: null,
    defaults: {
      name: "User Webhook"
    },
  },
  {
    type: "tallyTrigger",
    kind: NODE_KIND.TRIGGER,
    label: "Tally Form",
    service: "Tally",
    icon: FormInput,
    accent: "cyan",
    summaryKey: "form_name",
    defaults: {
      name: "Tally Form Trigger",
      connection_id: "",
      form_id: "",
      form_name: "",
    },
  },
  {
    type: "branch",
    kind: NODE_KIND.LOGIC,
    label: "IF/ELSE Branch",
    service: "AWS Step Functions",
    icon: GitBranch,
    accent: "violet",
    summaryKey: "variable",
    defaults: {
      name: "Check Condition",
      variable: "variable name",
      operator: "equals",
      value: "number",
    },
  },

  {
    type: "wait",
    kind: NODE_KIND.LOGIC,
    label: "Wait / Delay",
    service: "AWS Step Functions",
    icon: Timer,
    accent: "violet",
    summaryKey: "seconds",
    defaults: {
      name: "Wait Before Next Step",
      seconds: 60,
    },
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
      name: "Send Email",
      recipient: "user@example.com",
      subject: "Notification",
    },
  },

  {
    type: "slackNotify",
    kind: NODE_KIND.ACTION,
    label: "Slack Notification",
    service: "Slack",
    icon: MessageSquare,
    accent: "amber",
    summaryKey: "message",
    defaults: {
      name: "Send Slack Notification",
      webhook_url: "",
      message: "A workflow event has occurred.",
    },
  },

  {
    type: "discordNotify",
    kind: NODE_KIND.ACTION,
    label: "Discord Notification",
    service: "Discord",
    icon: MessageSquare,
    accent: "amber",
    summaryKey: "message",
    defaults: {
      name: "Send Discord Notification",
      webhook_url: "",
      message: "A workflow event has occurred.",
    },
  },

  {
    type: "doNothing",
    kind: NODE_KIND.ACTION,
    label: "Do Nothing",
    service: "Workflow Control",
    icon: Ban,
    accent: "amber",
    summaryKey: null,
    defaults: {
      name: "Do Nothing",
    },
  },
];

export const catalogByType = Object.fromEntries(
  nodeCatalog.map((entry) => [entry.type, entry])
);

export const librarySections = [
  { kind: NODE_KIND.TRIGGER, title: "Triggers" },
  { kind: NODE_KIND.LOGIC, title: "Filter/Logic Control" },
  { kind: NODE_KIND.ACTION, title: "Actions" },
];

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
