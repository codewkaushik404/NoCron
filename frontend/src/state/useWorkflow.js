import { useCallback } from "react";
import {
  addEdge as rfAddEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";

import {
  deployStatusState,
  edgesState,
  nodesState,
  selectedNodeIdState,
  workflowMetaState,
} from "./atoms.js";

import { catalogByType } from "../lib/nodeCatalog.js";
import { apiUrl } from "../lib/apiBase.js";
import { makeEdgeId, makeNodeId } from "../lib/ids.js";

export function useWorkflow() {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const setEdges = useSetRecoilState(edgesState);
  const [selectedId, setSelectedId] = useRecoilState(selectedNodeIdState);
  const setMeta = useSetRecoilState(workflowMetaState);
  const setDeployStatus = useSetRecoilState(deployStatusState);

  const addNode = useRecoilCallback(
    ({ set, snapshot }) =>
      async (type) => {
        const entry = catalogByType[type];
        if (!entry) return null;

        const existingNodes = await snapshot.getPromise(nodesState);

        if (
          entry.kind === "trigger" &&
          existingNodes.some(
            (node) => catalogByType[node.type]?.kind === "trigger",
          )
        ) {
          setDeployStatus({
            phase: "error",
            errors: ["A workflow can contain only one webhook trigger."],
            message: null,
          });

          return null;
        }

        const previousNode = existingNodes[existingNodes.length - 1];

        const id = makeNodeId();

        const node = {
          id,
          type,
          position: previousNode
            ? {
                x: previousNode.position.x,
                y:
                  previousNode.position.y +
                  (previousNode.measured?.height ?? 110) +
                  70,
              }
            : {
                x: 260,
                y: 120,
              },
          data: {
            ...entry.defaults,
          },
        };

        set(nodesState, (previous) => [...previous, node]);
        set(selectedNodeIdState, id);

        if (previousNode && entry.kind === "action") {
          set(edgesState, (previous) => [
            ...previous,
            {
              id: makeEdgeId(),
              source: previousNode.id,
              target: node.id,
              type: "deletable",
            },
          ]);
        }

        return id;
      },
    [setDeployStatus],
  );

  const updateNodeData = useCallback(
    (id, patch) => {
      setNodes((previous) =>
        previous.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...patch,
                },
              }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const removeNode = useCallback(
    (id) => {
      setNodes((previous) => previous.filter((node) => node.id !== id));

      setEdges((previous) =>
        previous.filter((edge) => edge.source !== id && edge.target !== id),
      );

      setSelectedId((current) => (current === id ? null : current));
    },
    [setNodes, setEdges, setSelectedId],
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((previous) => applyNodeChanges(changes, previous));
    },
    [setNodes],
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((previous) => applyEdgeChanges(changes, previous));
    },
    [setEdges],
  );

  const onConnect = useCallback(
    (connection) => {
      if (connection.source === connection.target) return;

      setEdges((previous) => {
        const duplicate = previous.some(
          (edge) =>
            edge.source === connection.source &&
            edge.target === connection.target,
        );

        const alreadyHasOutgoing = previous.some(
          (edge) => edge.source === connection.source,
        );

        const alreadyHasIncoming = previous.some(
          (edge) => edge.target === connection.target,
        );

        if (duplicate || alreadyHasOutgoing || alreadyHasIncoming) {
          return previous;
        }

        return rfAddEdge(
          {
            ...connection,
            id: makeEdgeId(),
          },
          previous,
        );
      });
    },
    [setEdges],
  );

  const removeEdge = useCallback(
    (id) => {
      setEdges((previous) => previous.filter((edge) => edge.id !== id));
    },
    [setEdges],
  );

  const renameWorkflow = useCallback(
    (name) => {
      setMeta((previous) => ({
        ...previous,
        name,
      }));
    },
    [setMeta],
  );

  const loadWorkflowById = useRecoilCallback(
    ({ set }) =>
      async (workflowId) => {
        try {
          const response = await fetch(
            apiUrl(`/api/v1/workflows/${workflowId}`),
            {
              credentials: "include",
            },
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result?.message || "Unable to load workflow.");
          }

          const workflow = result?.data;

          if (!workflow) {
            throw new Error("Workflow data was not returned.");
          }

          const loadedNodes = [];
          const loadedEdges = [];

          if (workflow.trigger) {
            loadedNodes.push({
              id: `trigger-${workflow.trigger.id}`,
              type: workflow.trigger.trigger.name,
              position: { x: 260, y: 100 },
              data: {
                name: workflow.trigger.name,
                ...(workflow.trigger.config ?? {}),
              },
            });
          }

          const actions = [...(workflow.actions ?? [])].sort(
            (a, b) => a.order - b.order,
          );

          actions.forEach((action, index) => {
            const actionNode = {
              id: `action-${action.id}`,
              type: action.action.name,
              position: {
                x: 260,
                y: 100 + (index + 1) * 190,
              },
              data: {
                name: action.name,
                ...(action.config ?? {}),
              },
            };

            const previousNode = loadedNodes[loadedNodes.length - 1];

            loadedNodes.push(actionNode);

            if (previousNode) {
              loadedEdges.push({
                id: makeEdgeId(),
                source: previousNode.id,
                target: actionNode.id,
                type: "deletable",
              });
            }
          });

          set(nodesState, loadedNodes);
          set(edgesState, loadedEdges);
          set(selectedNodeIdState, null);

          set(workflowMetaState, {
            name: workflow.name,
            workflowId: workflow.id,
            status: workflow.status,
            createdAt: workflow.created_at,
            updatedAt: workflow.updated_at,
          });

          return workflow;
        } catch (error) {
          set(deployStatusState, {
            phase: "error",
            errors: [
              error instanceof Error
                ? error.message
                : "Unable to load workflow.",
            ],
            message: null,
          });

          return null;
        }
      },
    [],
  );

  return {
    nodes,
    selectedId,
    addNode,
    loadWorkflowById,
    updateNodeData,
    removeNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    removeEdge,
    selectNode: setSelectedId,
    renameWorkflow,
  };
}
