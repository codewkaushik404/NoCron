import { useRecoilValue } from "recoil";
import { edgesState, nodesState, workflowMetaState } from "../../../state/atoms.js";
import { buildDeployPayload } from "../../../lib/serializer.js";
import CodeBlock from "./CodeBlock.jsx";

/** The exact JSON body "Deploy Workflow" would send to the Express API. */
export default function PayloadTab() {
  const meta = useRecoilValue(workflowMetaState);
  const nodes = useRecoilValue(nodesState);
  const edges = useRecoilValue(edgesState);

  const payload = buildDeployPayload({ meta, nodes, edges, isActive: meta.isActive });
  return <CodeBlock value={JSON.stringify(payload, null, 2)} />;
}
