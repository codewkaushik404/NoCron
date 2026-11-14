export function getExecutionOrder({ nodes, edges, catalog }) {
  const order = [];
  const visited = new Set();
  const catalogByType = Object.fromEntries(
    catalog.map((entry) => [entry.type, entry]),
  );

  let current = nodes.find(
    (node) => catalogByType[node.type]?.kind === "trigger",
  );

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    order.push(current);

    const nextEdge = edges.find((edge) => edge.source === current.id);

    current = nextEdge
      ? nodes.find((node) => node.id === nextEdge.target)
      : null;
  }

  return order;
}

export function buildPublishPayload({ meta, nodes, edges, catalog }) {
  const catalogByType = Object.fromEntries(
    catalog.map((entry) => [entry.type, entry]),
  );
  const order = getExecutionOrder({ nodes, edges, catalog });

  const trigger = order.find(
    (node) => catalogByType[node.type]?.kind === "trigger",
  );

  const actions = order
    .filter((node) => catalogByType[node.type]?.kind === "action")
    .map((node, index) => ({
      name: node.data.name,
      type: node.type,
      config: getNodeConfig(node, catalogByType[node.type]),
      order: index + 1,
    }));

  return {
    name: meta.name.trim(),

    trigger: {
      name: trigger.data.name,
      type: trigger.type,
      config: getNodeConfig(trigger, catalogByType[trigger.type]),
    },

    actions,
  };
}

function getNodeConfig(node, entry) {
  return Object.fromEntries(
    (entry?.fields ?? []).map((field) => [
      field.key,
      field.control === "number" ? Number(node.data[field.key]) : node.data[field.key],
    ]),
  );
}
