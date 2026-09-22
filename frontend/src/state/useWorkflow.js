import { useCallback } from "react";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { applyEdgeChanges, applyNodeChanges, addEdge as rfAddEdge } from "@xyflow/react";
import {
  edgesState,
  nodesState,
  selectedNodeIdState,
  workflowMetaState,
  deployStatusState,
} from "./atoms.js";
import { catalogByType } from "../lib/nodeCatalog.js";
import {
  getWorkflowHookId,
  makeHookId,
  makeNodeId,
  makeEdgeId,
} from "../lib/ids.js";

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
        if (type === "webhookTrigger" || type === "tallyTrigger") {
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

  const toggleActive = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const [currentMeta, currentNodes] = await Promise.all([
          snapshot.getPromise(workflowMetaState),
          snapshot.getPromise(nodesState),
        ]);

        try{
          // Only active → inactive is handled here.
          if (!currentMeta.isActive) throw new Error("Deploy the workflow to make it active");

          const backendUrl = import.meta.env.VITE_BACKEND_DEPLOY_URL?.trim();
          const hookId = getWorkflowHookId(currentNodes);

          if (!backendUrl || !hookId) {
            set(deployStatusState, {
              phase: "error",
              errors: ["Deploy the workflow before marking it inactive."],
              message: null,
            });

            return;
          }
          
          const response = await fetch(
            `${backendUrl.replace(/\/+$/, "")}/deploy/${encodeURIComponent(hookId)}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                is_active: false,
              }),
            }
          );

          if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `Unable to deactivate workflow (${response.status}).`);
          }

          // Only change frontend status after backend succeeds.
          set(workflowMetaState, (previous) => ({
            ...previous,
            isActive: false,
          }));
        } 
        catch (error) {
          set(deployStatusState, {
            phase: "error",
            errors: [
              error instanceof Error
                ? error.message
                : "Unable to deactivate workflow.",
            ],
            message: null,
          });
        }
      }, []
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