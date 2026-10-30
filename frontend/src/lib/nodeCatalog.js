import { Webhook, Timer, Mail, MessageSquare } from "lucide-react";

export const NODE_KIND = {
  TRIGGER: "trigger",
  ACTION: "action",
};

export const nodeCatalog = [
  {
    type: "webhook",
    kind: NODE_KIND.TRIGGER,
    label: "Webhook trigger",
    service: "Incoming webhook",
    icon: Webhook,
    accent: "teal",
    summaryKey: null,
    defaults: {
      name: "Webhook trigger",
    },
  },
  {
    type: "sendEmail",
    kind: NODE_KIND.ACTION,
    label: "Send email",
    service: "Email",
    icon: Mail,
    accent: "blue",
    summaryKey: "to",
    defaults: {
      name: "Send email",
      to: "",
      subject: "",
      body: "",
    },
  },
  {
    type: "sendDiscordMessage",
    kind: NODE_KIND.ACTION,
    label: "Send Discord message",
    service: "Discord",
    icon: MessageSquare,
    accent: "indigo",
    summaryKey: "message",
    defaults: {
      name: "Send Discord message",
      webhook_url: "",
      message: "",
    },
  },
  {
    type: "sendSlackMessage",
    kind: NODE_KIND.ACTION,
    label: "Send Slack message",
    service: "Slack",
    icon: MessageSquare,
    accent: "purple",
    summaryKey: "message",
    defaults: {
      name: "Send Slack message",
      webhook_url: "",
      message: "",
    },
  },
  {
    type: "wait",
    kind: NODE_KIND.ACTION,
    label: "Wait",
    service: "Wait",
    icon: Timer,
    accent: "slate",
    summaryKey: "wait_time",
    defaults: {
      name: "Wait",
      wait_time: 5,
    },
  },
];

export const catalogByType = Object.fromEntries(
  nodeCatalog.map((entry) => [entry.type, entry])
);

export const librarySections = [
  { kind: NODE_KIND.TRIGGER, title: "Triggers" },
  { kind: NODE_KIND.ACTION, title: "Sequential actions" },
];

export const accentStyles = {
  teal: {
    iconWrap: "bg-[#66745d]/10 text-[#4f5c48] ring-1 ring-[#66745d]/25",
    border: "hover:border-[#66745d]/60",
    chip: "bg-[#66745d]/10 text-[#4f5c48]",
  },

  blue: {
    iconWrap: "bg-[#64748b]/10 text-[#596579] ring-1 ring-[#64748b]/25",
    border: "hover:border-[#64748b]/60",
    chip: "bg-[#64748b]/10 text-[#596579]",
  },

  purple: {
    iconWrap: "bg-[#756477]/10 text-[#756477] ring-1 ring-[#756477]/25",
    border: "hover:border-[#756477]/60",
    chip: "bg-[#756477]/10 text-[#756477]",
  },

  indigo: {
    iconWrap: "bg-[#596579]/10 text-[#596579] ring-1 ring-[#596579]/25",
    border: "hover:border-[#596579]/60",
    chip: "bg-[#596579]/10 text-[#596579]",
  },

  slate: {
    iconWrap: "bg-[#77736b]/10 text-[#77736b] ring-1 ring-[#77736b]/25",
    border: "hover:border-[#77736b]/60",
    chip: "bg-[#77736b]/10 text-[#77736b]",
  },
};