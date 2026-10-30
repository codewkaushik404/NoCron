export const fieldSchemas = {
  webhook: [
    { key: "name", label: "Node name", control: "text" },
  ],

  sendEmail: [
    { key: "name", label: "Node name", control: "text" },
    {
      key: "to",
      label: "Recipient",
      control: "text",
      mono: true,
      required: true,
    },
    {
      key: "subject",
      label: "Subject",
      control: "text",
      required: true,
    },
    {
      key: "body",
      label: "Message",
      control: "textarea",
      required: true,
    },
  ],

  sendDiscordMessage: [
    { key: "name", label: "Node name", control: "text" },
    {
      key: "webhook_url",
      label: "Discord webhook URL",
      control: "text",
      mono: true,
      required: true,
    },
    {
      key: "message",
      label: "Message",
      control: "textarea",
      required: true,
    },
  ],

  sendSlackMessage: [
    { key: "name", label: "Node name", control: "text" },
    {
      key: "webhook_url",
      label: "Slack webhook URL",
      control: "text",
      mono: true,
      required: true,
    },
    {
      key: "message",
      label: "Message",
      control: "textarea",
      required: true,
    },
  ],

  wait: [
    { key: "name", label: "Node name", control: "text" },
    {
      key: "wait_time",
      label: "Wait time in minutes",
      control: "number",
      min: 0,
      required: true,
    },
  ],
};