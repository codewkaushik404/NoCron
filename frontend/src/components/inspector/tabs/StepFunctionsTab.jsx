import { useRecoilValue } from "recoil";
import { edgesState, nodesState } from "../../../state/atoms.js";
import { buildStateMachine } from "../../../lib/serializer.js";
import CodeBlock from "./CodeBlock.jsx";

/** A simplified AWS States Language preview generated from the graph's edges. */
export default function StepFunctionsTab() {
  const nodes = useRecoilValue(nodesState);
  const edges = useRecoilValue(edgesState);

  const definition = buildStateMachine({ nodes, edges });
  return <CodeBlock value={JSON.stringify(definition, null, 2)} />;
}