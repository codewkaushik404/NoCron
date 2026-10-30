export function getExecutionOrder({ nodes, edges }) {
  const order = [];
  const visited = new Set();

  let current = nodes.find((node) => node.type === "webhook");

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

export function buildPublishPayload({ meta, nodes, edges }) {
  const order = getExecutionOrder({ nodes, edges });

  const trigger = order.find((node) => node.type === "webhook");

  const actions = order
    .filter((node) => node.type !== "webhook")
    .map((node, index) => ({
      name: node.data.name,
      type: node.type,
      config: getActionConfig(node),
      order: index + 1,
    }));

  return {
    name: meta.name.trim(),

    trigger: {
      name: trigger.data.name,
      type: "webhook",
      config: {},
    },

    actions,
  };
}

function getActionConfig(node) {
  switch (node.type) {
    case "sendEmail":
      return {
        to: node.data.to,
        subject: node.data.subject,
        body: node.data.body,
      };

    case "sendDiscordMessage":
    case "sendSlackMessage":
      return {
        webhook_url: node.data.webhook_url,
        message: node.data.message,
      };

    case "wait":
      return {
        wait_time: Number(node.data.wait_time),
      };

    default:
      return {};
  }
}
