/**
 * Per-type field schemas for the inspector's Config tab. Phase 1 iterated
 * over `Object.entries(node.data)` generically; this replaces that with a
 * typed control per field (select, number, textarea) plus optional hints and
 * required flags, keyed off the same types declared in nodeCatalog.js.
 */
export const fieldSchemas = {
  scheduleTrigger: [
    { key: "name", label: "Node name", control: "text" },
    {
      key: "expression",
      label: "Schedule expression",
      control: "text",
      mono: true,
      required: true,
      hint: "cron() or rate() syntax, evaluated in the timezone below.",
    },
    {
      key: "timezone",
      label: "Time zone",
      control: "select",
      options: ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Kolkata"],
    },
  ],
  webhookTrigger: [
    { key: "name", label: "Node name", control: "text" },
  ],
  branch: [
    { key: "name", label: "Node name", control: "text" },
    { key: "variable", label: "Variable", control: "text", mono: true, required: true, hint: "Enter the field name from the incoming webhook data." },
    {
      key: "operator",
      label: "Operator",
      control: "select",
      options: ["equals", "notEquals", "greaterThan", "lessThan", "contains"],
    },
    { key: "value", label: "Value", control: "text", mono: true, required: true },
  ],
  wait: [
    { key: "name", label: "Node name", control: "text" },
    { key: "seconds", label: "Delay in seconds", control: "number", min: 1, required: true },
  ],
  sendEmail: [
    { key: "name", label: "Node name", control: "text" },
    { key: "recipient", label: "Recipient", control: "text", mono: true, required: true },
    { key: "subject", label: "Subject", control: "text" },
    { key: "body", label: "Message body", control: "textarea" },
  ],
  slackNotify: [
    { key: "name", label: "Node name", control: "text" },
    { key: "channel", label: "Channel", control: "text", mono: true, required: true },
    { key: "message", label: "Message", control: "textarea" },
  ],
};
