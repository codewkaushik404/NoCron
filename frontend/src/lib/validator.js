import { NODE_KIND } from "./nodeCatalog.js";

/**
 * Structural checks run before "Deploy Workflow" is allowed to serialize and
 * send the graph. Pure function of the graph, so the deploy hook and any
 * future "validate as you go" UI can both call it without duplicating rules.
 */
export function validateWorkflow({ nodes, edges, catalog = [] }) {
  const errors = [];
  const catalogByType = Object.fromEntries(
    catalog.map((entry) => [entry.type, entry]),
  );

  const hasTrigger = nodes.some(
    (node) => catalogByType[node.type]?.kind === NODE_KIND.TRIGGER,
  );
  if (!hasTrigger) {
    errors.push("Add at least one trigger block to start the workflow.");
  }

  const hasAction = nodes.some(
    (node) => catalogByType[node.type]?.kind === NODE_KIND.ACTION,
  );
  if (!hasAction) {
    errors.push("Add at least one action block to the workflow.");
  }

  nodes.forEach((node) => {
    const entry = catalogByType[node.type];
    if (!entry) {
      errors.push(`"${node.data.name || node.type}" is no longer available.`);
      return;
    }

    const label = node.data.name || entry.label;

    if (entry.kind !== NODE_KIND.TRIGGER) {
      const hasIncoming = edges.some((edge) => edge.target === node.id);
      if (!hasIncoming) {
        errors.push(`"${label}" isn't connected to anything upstream.`);
      }
    }

    entry.fields
      ?.filter((field) => field.required)
      .forEach(({ key }) => {
        const value = node.data[key];
        const empty =
          value === undefined ||
          value === null ||
          value === "" ||
          (typeof value === "number" && value < 0);
        if (empty) {
          errors.push(`"${label}" is missing a value for ${key}.`);
        }
      });

  });

  return { valid: errors.length === 0, errors };
}
