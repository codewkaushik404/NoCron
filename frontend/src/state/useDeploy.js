import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  deployStatusState,
  edgesState,
  nodesState,
  workflowMetaState,
} from "./atoms.js";

import { validateWorkflow } from "../lib/validator.js";
import { buildPublishPayload } from "../lib/serializer.js";
import { apiUrl } from "../lib/apiBase.js";

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

        const validation = validateWorkflow({ nodes, edges });

        if (!validation.valid) {
          set(deployStatusState, {
            phase: "error",
            errors: validation.errors,
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
          const response = await fetch(apiUrl("/api/v1/workflows/publish"), {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              buildPublishPayload({
                meta,
                nodes,
                edges,
              }),
            ),
          });

          const result = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(
              result?.message ||
                result?.error ||
                "The backend rejected the workflow.",
            );
          }

          const workflow = result?.data ?? result?.workflow ?? result;

          if (!workflow?.id) {
            throw new Error(
              "The workflow was created, but its ID was not returned.",
            );
          }

          set(workflowMetaState, (previous) => ({
            ...previous,
            name: workflow.name ?? previous.name,
            workflowId: workflow.id,
            status: workflow.status ?? "ACTIVE",
            createdAt: workflow.created_at ?? null,
            updatedAt: workflow.updated_at ?? null,
          }));

          set(deployStatusState, {
            phase: "success",
            errors: [],
            message: "Workflow published successfully.",
          });
        } catch (error) {
          set(deployStatusState, {
            phase: "error",
            errors: [
              error instanceof Error
                ? error.message
                : "Unable to publish workflow.",
            ],
            message: null,
          });
        }
      },
    [],
  );

  const simulate = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const [nodes, edges] = await Promise.all([
          snapshot.getPromise(nodesState),
          snapshot.getPromise(edgesState),
        ]);

        const validation = validateWorkflow({ nodes, edges });

        if (!validation.valid) {
          set(deployStatusState, {
            phase: "error",
            errors: validation.errors,
            message: null,
          });

          return;
        }

        set(deployStatusState, {
          phase: "success",
          errors: [],
          message: "Workflow structure is valid.",
        });
      },
    [],
  );

  const dismiss = useRecoilCallback(
    ({ set }) =>
      () => {
        set(deployStatusState, {
          phase: "idle",
          errors: [],
          message: null,
        });
      },
    [],
  );

  return {
    status,
    deploy,
    simulate,
    dismiss,
  };
}
