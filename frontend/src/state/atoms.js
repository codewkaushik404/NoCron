import { atom, selector } from "recoil";

export const workflowMetaState = atom({
  key: "workflowMeta",
  default: {
    name: "Untitled workflow",
    workflowId: null,
    status: "DRAFT",
    createdAt: null,
    updatedAt: null,
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

export const inspectorTabState = atom({
  key: "inspectorTab",
  default: "payload",
});

export const deployStatusState = atom({
  key: "deployStatus",
  default: {
    phase: "idle",
    errors: [],
    message: null,
  },
});

export const workflowLoadState = atom({
  key: "workflowLoad",
  default: "ready",
});

export const executionLogsState = atom({
  key: "executionLogs",
  default: [],
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



