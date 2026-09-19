import { useCallback } from "react";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { applyEdgeChanges, applyNodeChanges, addEdge as rfAddEdge } from "@xyflow/react";
import {
  edgesState,
  nodesState,
  selectedNodeIdState,
  workflowMetaState,
} from "./atoms.js";
import { catalogByType } from "../lib/nodeCatalog.js";
import { makeHookId, makeNodeId, makeEdgeId } from "../lib/ids.js";

/**
 * Every mutation to the graph goes through this hook. Components never call
 * `setNodes` directly, which keeps node shape and id generation in one place.
 */
export function useWorkflow() {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const setEdges = useSetRecoilState(edgesState);
  const [selectedId, setSelectedId] = useRecoilState(selectedNodeIdState);
  const setMeta = useSetRecoilState(workflowMetaState);

  /** Drop a catalog block onto the canvas at a given position. */
  const addNode = useRecoilCallback(
    ({ set, snapshot }) =>
      async (type, position) => {
        const entry = catalogByType[type];
        if (!entry) return null;

        const existing = await snapshot.getPromise(nodesState);
        const id = makeNodeId();
        const at = position ?? nextFreeSlot(existing);

        const node = {
          id,
          type,
          position: at,
          data: { ...entry.defaults },
        };

        // Webhook blocks mint their public URL on creation, client-side.
        if (type === "webhookTrigger") {
          node.data.hookId = makeHookId();
        }

        set(nodesState, (prev) => [...prev, node]);
        set(selectedNodeIdState, id);
        return id;
      },
    []
  );

  const updateNodeData = useCallback(
    (id, patch) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...patch } } : node
        )
      );
    },
    [setNodes]
  );

  const moveNode = useCallback(
    (id, position) => {
      setNodes((prev) =>
        prev.map((node) => (node.id === id ? { ...node, position } : node))
      );
    },
    [setNodes]
  );

  const removeNode = useCallback(
    (id) => {
      setNodes((prev) => prev.filter((node) => node.id !== id));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== id && edge.target !== id)
      );
      setSelectedId((current) => (current === id ? null : current));
    },
    [setNodes, setEdges, setSelectedId]
  );

  /** React Flow reports drags, selection and Backspace-deletes as a batch of changes. */
  const onNodesChange = useCallback(
    (changes) => setNodes((prev) => applyNodeChanges(changes, prev)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((prev) => applyEdgeChanges(changes, prev)),
    [setEdges]
  );

  /** Fired when the user drags a connection line from one handle to another. */
  const onConnect = useCallback(
    (connection) => {
      if (connection.source === connection.target) return;
      setEdges((prev) => {
        const duplicate = prev.some(
          (edge) =>
            edge.source === connection.source &&
            edge.target === connection.target &&
            edge.sourceHandle === connection.sourceHandle
        );
        if (duplicate) return prev;
        return rfAddEdge({ ...connection, id: makeEdgeId() }, prev);
      });
    },
    [setEdges]
  );

  const removeEdge = useCallback(
    (id) => setEdges((prev) => prev.filter((edge) => edge.id !== id)),
    [setEdges]
  );

  const renameWorkflow = useCallback(
    (name) => setMeta((prev) => ({ ...prev, name })),
    [setMeta]
  );

  const toggleActive = useCallback(
    () => setMeta((prev) => ({ ...prev, active: !prev.active })),
    [setMeta]
  );

  return {
    nodes,
    selectedId,
    addNode,
    updateNodeData,
    moveNode,
    removeNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    removeEdge,
    selectNode: setSelectedId,
    renameWorkflow,
    toggleActive,
  };
}

/** Cascade new blocks so click-to-add never stacks two cards on one spot. */
function nextFreeSlot(nodes) {
  const step = 60;
  return { x: 160 + nodes.length * step, y: 140 + (nodes.length % 4) * step };
}