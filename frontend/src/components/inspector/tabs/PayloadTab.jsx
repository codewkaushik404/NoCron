import { useRecoilValue } from "recoil";
import {
  edgesState,
  nodesState,
  workflowMetaState,
} from "../../../state/atoms.js";
import { buildPublishPayload } from "../../../lib/serializer.js";

export default function PayloadTab() {
  const meta = useRecoilValue(workflowMetaState);
  const nodes = useRecoilValue(nodesState);
  const edges = useRecoilValue(edgesState);

  let payload;

  try {
    payload = buildPublishPayload({
      meta,
      nodes,
      edges,
    });
  } catch {
    payload = {
      name: meta.name,
      trigger: null,
      actions: [],
    };
  }

}
