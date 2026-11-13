import FlowNode from "./FlowNode.jsx";

/** Every catalog type renders through the same FlowNode component. */
export function createNodeTypes(entries) {
  return Object.fromEntries(entries.map((entry) => [entry.type, FlowNode]));
}
