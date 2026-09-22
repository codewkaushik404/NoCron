import { catalogByType, NODE_KIND } from "./nodeCatalog.js";

/**
 * Turns the live graph into 
 * (a) the JSON payload "Deploy Workflow" sends to
 * the Express API 
 * (b) a simplified AWS States Language document for the
 * Step Functions preview tab. Both read the same {meta, nodes, edges} shape
 * the Recoil store already holds, so the inspector tabs and the deploy hook
 * share one source of truth instead of formatting JSON inline in components.
 */

export function buildDeployPayload({ meta, nodes, edges, isActive }) {
  
  return {
    is_active: isActive,
    user_id: meta?.user_id ?? null,
    node_config: {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),

      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        dest: edge.target,
        sourceHandle: edge.sourceHandle ?? null,
      })),
    },
  };
}

/**
 * Illustrative ASL generation, not a full compiler: enough to show the shape
 * of what deploying would produce, following the edges out of each node to
 * fill in Next/End. Branch nodes become Choice states using their True/False
 * handles; everything else becomes a Task or a Wait.
 */
export function buildStateMachine({ nodes, edges }) {
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const stateName = (node) => `${node.type}_${node.id.replace("node-", "")}`;
  const outgoing = (id, handle) =>
    edges.find((edge) => edge.source === id && (handle ? edge.sourceHandle === handle : !edge.sourceHandle));

  const trigger = nodes.find((node) => catalogByType[node.type]?.kind === NODE_KIND.TRIGGER);
  const states = {};

  nodes
    .filter((node) => node !== trigger)
    .forEach((node) => {
      const name = stateName(node);

      if (node.type === "branch") {
        const trueEdge = outgoing(node.id, "true");
        const falseEdge = outgoing(node.id, "false");
        states[name] = {
          Type: "Choice",
          Choices: [
            {
              Variable: `question_${node.data.variable}`,
              StringEquals: node.data.value,
              Next: trueEdge ? stateName(byId[trueEdge.target]) : undefined,
            },
          ],
          Default: falseEdge ? stateName(byId[falseEdge.target]) : undefined,
        };
      } else if (node.type === "wait") {
        const next = outgoing(node.id);
        states[name] = {
          Type: "Wait",
          Seconds: node.data.seconds,
          Next: next ? stateName(byId[next.target]) : undefined,
          End: !next,
        };
      } else {
        const next = outgoing(node.id);
        states[name] = {
          Type: "Task",
          Resource:
            node.type === "sendEmail"
              ? "arn:aws:states:::aws-sdk:sesv2:sendEmail"
              : undefined,
          Parameters: node.data,
          Next: next ? stateName(byId[next.target]) : undefined,
          End: !next,
        };
      }

    });

  const firstEdge = trigger ? outgoing(trigger.id) : null;

  return {
    Comment: trigger ? `Generated from ${trigger.data.name}` : "No trigger configured yet",
    StartAt: firstEdge ? stateName(byId[firstEdge.target]) : null,
    States: states,
  };
}

export function getExecutionOrder({ nodes, edges }) {
  const machine = buildStateMachine({ nodes, edges });
  const byName = Object.fromEntries(
    nodes.map((node) => [`${node.type}_${node.id.replace("node-", "")}`, node])
  );
  const order = [];
  let next = machine.StartAt;
  const visited = new Set();

  while (next && !visited.has(next) && byName[next]) {
    visited.add(next);
    const node = byName[next];
    order.push(node);
    const outgoing = edges.find((edge) => edge.source === node.id);
    next = outgoing ? `${byName[outgoing.target]?.type}_${outgoing.target.replace("node-", "")}` : null;
  }

  return order;
}
