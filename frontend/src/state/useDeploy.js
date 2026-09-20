import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  edgesState,
  executionLogsState,
  nodesState,
  workflowMetaState,
  deployStatusState,
} from "./atoms.js";

import { validateWorkflow } from "../lib/validator.js";
import {
  buildDeployPayload,
  getExecutionOrder,
} from "../lib/serializer.js";
import { makeHookId } from "../lib/ids.js";

export function useDeploy() {
  const status = useRecoilValue(deployStatusState);

  const deploy = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const [nodes, edges, meta] = await Promise.all([
          snapshot.getPromise(nodesState),
          snapshot.getPromise(edgesState),
          snapshot.getPromise(workflowMetaState),
        ]);

        const result = validateWorkflow({ nodes, edges });

        if (!result.valid) {
          set(deployStatusState, {
            phase: "error",
            errors: result.errors,
            message: null,
          });
          return;
        }

        const backendUrl =
          import.meta.env.VITE_BACKEND_DEPLOY_URL?.trim();

        if (!backendUrl) {
          set(deployStatusState, {
            phase: "error",
            errors: [
              "Set VITE_BACKEND_DEPLOY_URL in frontend/.env before deploying.",
            ],
            message: null,
          });
          return;
        }

        set(deployStatusState, {
          phase: "deploying",
          errors: [],
          message: null,
        });

        try {
          const webhookNode = nodes.find(
            (node) => node.type === "webhookTrigger"
          );
          const hookId = webhookNode
            ? webhookNode.data?.hookId?.trim()
            : makeHookId();

          if (webhookNode && !hookId) {
            set(deployStatusState, {
              phase: "error",
              errors: ["The webhook trigger is missing its hook ID."],
              message: null,
            });
            return;
          }

          const baseUrl = backendUrl.replace(/\/+$/, "");
          const deployUrl = `${baseUrl}/${encodeURIComponent(hookId)}`;

          const response = await fetch(deployUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              buildDeployPayload({
                meta,
                nodes,
                edges,
                isActive: meta.isActive,
              })
            ),
          });

          if (!response.ok) {
            const responseText = await response.text();

            throw new Error(
              responseText
                ? `Backend rejected deployment (${response.status}): ${responseText}`
                : `Backend rejected deployment with status ${response.status}.`
            );
          }

          // Mark workflow active only after successful deployment
          set(workflowMetaState, (previous) => ({
            ...previous,
            isActive: true,
          }));

          set(deployStatusState, {
            phase: "success",
            errors: [],
            message: "Workflow deployed successfully.",
          });
        } catch (error) {
          set(deployStatusState, {
            phase: "error",
            errors: [
              error instanceof Error
                ? error.message
                : "Unable to reach the deployment backend.",
            ],
            message: null,
          });
        }
      },
    []
  );

  const simulate = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const [nodes, edges] = await Promise.all([
          snapshot.getPromise(nodesState),
          snapshot.getPromise(edgesState),
        ]);

        const result = validateWorkflow({ nodes, edges });

        if (!result.valid) {
          set(deployStatusState, {
            phase: "error",
            errors: result.errors,
            message: null,
          });
          return;
        }

        const executionId = `sim-${Date.now()}`;
        const startedAt = new Date().toISOString();
        const order = getExecutionOrder({ nodes, edges });

        set(deployStatusState, {
          phase: "simulating",
          errors: [],
          message: null,
        });

        const logs = [
          {
            executionId,
            timestamp: startedAt,
            status: "started",
            message:
              "Simulation started. No workflow was saved or activated.",
          },

          ...order.map((node) => ({
            executionId,
            timestamp: new Date().toISOString(),
            status: "success",
            message: `Executed ${node.data.name || node.type}.`,
          })),

          {
            executionId,
            timestamp: new Date().toISOString(),
            status: "success",
            message: "Simulation completed successfully.",
          },
        ];

        set(executionLogsState, (previous) => [
          ...logs,
          ...previous,
        ]);

        set(deployStatusState, {
          phase: "success",
          errors: [],
          message:
            "Simulation completed. Workflow remains inactive.",
        });
      },
    []
  );

  const dismiss = useRecoilCallback(
    ({ set }) =>
      () =>
        set(deployStatusState, {
          phase: "idle",
          errors: [],
          message: null,
        }),
    []
  );

  return {
    status,
    deploy,
    simulate,
    dismiss,
  };
}