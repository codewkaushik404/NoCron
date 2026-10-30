import { Handle, Position } from "@xyflow/react";
import { useRecoilValue } from "recoil";
import { catalogByType, NODE_KIND } from "../../lib/nodeCatalog.js";
import { selectedNodeIdState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import NodeCard from "./NodeCard.jsx";

const handleClass =
  "!h-3 !w-3 !rounded-full !border-2 !border-panel !bg-line-strong hover:!bg-cyan";

export default function FlowNode({ id, data, type }) {
  const entry = catalogByType[type];
  const selectedNodeId = useRecoilValue(selectedNodeIdState);
  const { selectNode, removeNode } = useWorkflow();

  if (!entry) return null;

  const selected = id === selectedNodeId;
  const isTrigger = entry.kind === NODE_KIND.TRIGGER;

  return (
    <div className="relative">
      {!isTrigger ? (
        <Handle
          type="target"
          position={Position.Top}
          className={`${handleClass} !top-[-6px]`}
        />
      ) : null}

      <NodeCard
        node={{ id, type, data }}
        selected={selected}
        onSelect={selectNode}
        onDelete={removeNode}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className={`${handleClass} !bottom-[-6px]`}
      />
    </div>
  );
}
