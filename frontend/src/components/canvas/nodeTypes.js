import FlowNode from "./FlowNode.jsx";
import { nodeCatalog } from "../../lib/nodeCatalog.js";

/** Every catalog type renders through the same FlowNode component. */
export const nodeTypes = Object.fromEntries(
  nodeCatalog.map((entry) => [entry.type, FlowNode])
);
