import { Handle, Position } from "@xyflow/react";
import { useRecoilValue } from "recoil";
import { catalogByType, NODE_KIND } from "../../lib/nodeCatalog.js";
import { selectedNodeIdState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import NodeCard from "./NodeCard.jsx";

/**
 * Generic React Flow custom node: it renders NodeCard as the body and adds
 * the handles a block's kind needs. One component covers every catalog type
 * because handle layout only depends on `kind` (and the branch special case),
 * not on the block itself — a new action or trigger type needs zero changes
 * here.
 *
 * Selection is read from Recoil (not React Flow's own internal selection)
 * so the inspector panel and the canvas outline always agree.
 */
const dot = "!h-3 !w-3 !rounded-full !border-2 !border-panel transition-colors";

export default function FlowNode({ id, data, type }) {
  const entry = catalogByType[type];
  const selectedId = useRecoilValue(selectedNodeIdState);
  const { selectNode, removeNode } = useWorkflow();

  if (!entry) return null;

  const isTrigger = entry.kind === NODE_KIND.TRIGGER;
  const isBranch = type === "branch";
  const selected = id === selectedId;

  return (
    <div className="relative">
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className={`${dot} !left-[-6px] !bg-line-strong hover:!bg-cyan`}
        />
      )}

      <NodeCard
        node={{ id, type, data }}
        selected={selected}
        onSelect={selectNode}
        onDelete={removeNode}
      />

      {isBranch ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ top: "42%" }}
            className={`${dot} !right-[-6px] !bg-emerald-600 hover:!bg-emerald-500`}
          />
          <span className="pointer-events-none absolute right-[-38px] top-[34%] font-mono text-[10px] font-semibold text-emerald-700">
            True
          </span>

          <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ top: "72%" }}
            className={`${dot} !right-[-6px] !bg-rose-600 hover:!bg-rose-500`}
          />
          <span className="pointer-events-none absolute right-[-42px] top-[64%] font-mono text-[10px] font-semibold text-rose-700">
            False
          </span>
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className={`${dot} !right-[-6px] !bg-line-strong hover:!bg-cyan`}
        />
      )}
    </div>
  );
}