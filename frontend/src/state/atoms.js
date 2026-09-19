import { atom, selector } from "recoil";

/**
 * Recoil is the only place graph state lives. React Flow (Phase 2) is treated
 * as a rendering surface: it reads nodes/edges from here and writes changes
 * back through the actions in `useWorkflow`.
 */

export const workflowMetaState = atom({
  key: "workflowMeta",
  default: {
    id: null,
    name: "No-Cron Automated Execution Flow",
    version: "1.0.0",
    region: "us-east-1",
    active: false,
  },
});

export const nodesState = atom({
  key: "nodes",
  default: [],
});

export const edgesState = atom({
  key: "edges",
  default: [],
});

export const selectedNodeIdState = atom({
  key: "selectedNodeId",
  default: null,
});

/** Which inspector output tab is showing, below the node's own fields. */
export const inspectorTabState = atom({
  key: "inspectorTab",
  default: "payload",
});

/** Lifecycle of the last "Deploy Workflow" click: idle | deploying | success | error. */
export const deployStatusState = atom({
  key: "deployStatus",
  default: { phase: "idle", errors: [] },
});

export const selectedNodeState = selector({
  key: "selectedNode",
  get: ({ get }) => {
    const id = get(selectedNodeIdState);
    if (!id) return null;
    return get(nodesState).find((node) => node.id === id) ?? null;
  },
});

export const graphStatsState = selector({
  key: "graphStats",
  get: ({ get }) => ({
    nodeCount: get(nodesState).length,
    edgeCount: get(edgesState).length,
  }),
});