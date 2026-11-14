import { Webhook, Mail, MessageSquare } from "lucide-react";

export const NODE_KIND = {
  TRIGGER: "trigger",
  ACTION: "action",
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

  if (!Array.isArray(record.fields)) {
    throw new Error(`Available node "${record.name}" has no field schema.`);
  }

  const label = record.name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
  const fields = record.fields.filter(
    (field) =>
      field &&
      typeof field.key === "string" &&
      typeof field.label === "string" &&
      ["text", "textarea", "number"].includes(field.control),
  );
  const defaults = Object.fromEntries(
    fields.map((field) => [
      field.key,
      field.defaultValue ?? (field.control === "number" ? field.min ?? 0 : ""),
    ]),
  );
  const icon = kind === NODE_KIND.TRIGGER
    ? Webhook
    : /email/i.test(record.name)
      ? Mail
      : MessageSquare;

  return {
    id: record.id,
    type: record.name,
    kind,
    label,
    service: label,
    icon,
    accent: kind === NODE_KIND.TRIGGER ? "teal" : /email/i.test(record.name) ? "blue" : "slate",
    summaryKey: fields[0]?.key ?? null,
    image_url: typeof record.image_url === "string" ? record.image_url : "",
    fields,
    defaults: { name: label, ...defaults },
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
