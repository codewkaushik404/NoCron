import { Webhook, Timer, Mail, MessageSquare } from "lucide-react";

export const NODE_KIND = {
  TRIGGER: "trigger",
  ACTION: "action",
};

const presentations = {
  webhook: {
    label: "Webhook trigger",
    service: "Incoming webhook",
    icon: Webhook,
    accent: "teal",
    defaults: { name: "Webhook trigger" },
  },
  sendEmail: {
    label: "Send email",
    service: "Email",
    icon: Mail,
    accent: "blue",
    summaryKey: "to",
    defaults: { name: "Send email", to: "", subject: "", body: "" },
  },
  sendDiscordMessage: {
    label: "Send Discord message",
    service: "Discord",
    icon: MessageSquare,
    accent: "indigo",
    summaryKey: "message",
    defaults: { name: "Send Discord message", webhook_url: "", message: "" },
  },
  sendSlackMessage: {
    label: "Send Slack message",
    service: "Slack",
    icon: MessageSquare,
    accent: "purple",
    summaryKey: "message",
    defaults: { name: "Send Slack message", webhook_url: "", message: "" },
  },
  wait: {
    label: "Wait",
    service: "Wait",
    icon: Timer,
    accent: "slate",
    summaryKey: "wait_time",
    defaults: { name: "Wait", wait_time: 5 },
  },
};

export const librarySections = [
  { kind: NODE_KIND.TRIGGER, title: "Triggers" },
  { kind: NODE_KIND.ACTION, title: "Actions" },
];

export function createNodeCatalog(triggers, actions) {
  if (!Array.isArray(triggers) || !Array.isArray(actions)) {
    throw new Error("The available node lists must be arrays.");
  }

  return [
    ...triggers.map((record) => createCatalogEntry(record, NODE_KIND.TRIGGER)),
    ...actions.map((record) => createCatalogEntry(record, NODE_KIND.ACTION)),
  ];
}

function createCatalogEntry(record, kind) {
  if (
    !record ||
    typeof record.id !== "string" ||
    typeof record.name !== "string" ||
    !record.name
  ) {
    throw new Error("An available node is missing its id or name.");
  }

  const presentation = presentations[record.name] ?? {};
  const label =
    presentation.label ??
    record.name
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/^./, (character) => character.toUpperCase());

  return {
    id: record.id,
    type: record.name,
    kind,
    label,
    service: presentation.service ?? label,
    icon: presentation.icon ?? (kind === NODE_KIND.TRIGGER ? Webhook : MessageSquare),
    accent: presentation.accent ?? (kind === NODE_KIND.TRIGGER ? "teal" : "slate"),
    summaryKey: presentation.summaryKey ?? null,
    image_url: typeof record.image_url === "string" ? record.image_url : "",
    defaults: { name: label, ...presentation.defaults },
  };
}

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
