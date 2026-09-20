import { catalogByType, NODE_KIND } from "./nodeCatalog.js";

const requiredFields = {
  webhookTrigger: [],
  scheduleTrigger: ["expression"],
  branch: ["variable", "value"],
  wait: ["seconds"],
  sendEmail: ["recipient"],
  slackNotify: ["channel"],
};

/**
 * Structural checks run before "Deploy Workflow" is allowed to serialize and
 * send the graph. Pure function of the graph, so the deploy hook and any
 * future "validate as you go" UI can both call it without duplicating rules.
 */
export function validateWorkflow({ nodes, edges }) {
  const errors = [];

  const hasTrigger = nodes.some((node) => catalogByType[node.type]?.kind === NODE_KIND.TRIGGER);
  if (!hasTrigger) {
    errors.push("Add at least one trigger block to start the workflow.");
  }

  nodes.forEach((node) => {
    const entry = catalogByType[node.type];
    if (!entry) return;
    const label = node.data.name || entry.label;

    if (entry.kind !== NODE_KIND.TRIGGER) {
      const hasIncoming = edges.some((edge) => edge.target === node.id);
      if (!hasIncoming) {
        errors.push(`"${label}" isn't connected to anything upstream.`);
      }
    }

    (requiredFields[node.type] ?? []).forEach((key) => {
      const value = node.data[key];
      const empty =
        value === undefined ||
        value === null ||
        value === "" ||
        (typeof value === "number" && value <= 0);
      if (empty) {
        errors.push(`"${label}" is missing a value for ${key}.`);
      }
    });

    if (node.type === "branch") {
      const hasTrue = edges.some((edge) => edge.source === node.id && edge.sourceHandle === "true");
      const hasFalse = edges.some((edge) => edge.source === node.id && edge.sourceHandle === "false");
      if (!hasTrue || !hasFalse) {
        errors.push(`"${label}" needs both a True and a False path connected.`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}
