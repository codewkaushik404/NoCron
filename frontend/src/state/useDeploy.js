import { useRecoilCallback, useRecoilValue } from "recoil";
import { edgesState, nodesState, workflowMetaState, deployStatusState } from "./atoms.js";
import { validateWorkflow } from "../lib/validator.js";

/**
 * Owns the "Deploy Workflow" lifecycle: validate the live graph, then send
 * it. This frontend has no backend wired up yet, so the send step is a
 * timed simulation — swap it for a real `fetch` (see lib/serializer.js's
 * buildDeployPayload for the exact body) once the Express API exists.
 */
export function useDeploy() {
  const status = useRecoilValue(deployStatusState);

  const deploy = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const [nodes, edges] = await Promise.all([
          snapshot.getPromise(nodesState),
          snapshot.getPromise(edgesState),
        ]);

        const result = validateWorkflow({ nodes, edges });
        if (!result.valid) {
          set(deployStatusState, { phase: "error", errors: result.errors });
          return;
        }

        set(deployStatusState, { phase: "deploying", errors: [] });
        await new Promise((resolve) => setTimeout(resolve, 900));

        set(deployStatusState, { phase: "success", errors: [] });
        set(workflowMetaState, (prev) => ({ ...prev, active: true }));

        setTimeout(() => {
          set(deployStatusState, (prev) => (prev.phase === "success" ? { phase: "idle", errors: [] } : prev));
        }, 2600);
      },
    []
  );

  const dismiss = useRecoilCallback(
    ({ set }) =>
      () => set(deployStatusState, { phase: "idle", errors: [] }),
    []
  );

  return { status, deploy, dismiss };
}
