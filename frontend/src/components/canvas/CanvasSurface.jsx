import { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useRecoilValue } from "recoil";
import { MousePointerClick, Trash2 } from "lucide-react";
import { nodesState, edgesState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import { nodeTypes } from "./nodeTypes.js";

const defaultEdgeOptions = {
  type: "deletable",
  style: { stroke: "#8C8477", strokeWidth: 1.75 },
};

/**
 * The real canvas. Nodes/edges live in Recoil and are handed to React Flow
 * as-is (our node/edge shape already matches what it expects), so there's no
 * conversion layer between the store and the render.
 */
function Surface() {
  const nodes = useRecoilValue(nodesState);
  const edges = useRecoilValue(edgesState);
  const {
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    removeEdge,
    selectNode,
  } = useWorkflow();
  const { screenToFlowPosition } = useReactFlow();

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/nocron-node");
      if (!type) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode(type, { x: position.x - 128, y: position.y - 40 });
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      className="relative flex-1 overflow-hidden bg-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges.map((edge) => ({
          ...edge,
          data: { ...edge.data, onDelete: removeEdge },
        }))}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => selectNode(null)}
        onEdgeClick={() => selectNode(null)}
        onEdgesDelete={(deletedEdges) => deletedEdges.forEach((edge) => removeEdge(edge.id))}
        edgeTypes={{ deletable: DeletableEdge }}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView={nodes.length > 0}
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.35}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        {/* Two stacked dot/line layers approximate the drafting-table grid
            from the paper theme, but panning and zooming with the canvas
            instead of staying fixed like a CSS background would. */}
        <Background id="fine" variant={BackgroundVariant.Dots} gap={20} size={1} color="#D9D2BE" />
        <Background id="coarse" variant={BackgroundVariant.Lines} gap={140} lineWidth={1} color="#C3B999" />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>

      {nodes.length === 0 ? <EmptyCanvas /> : null}

      <p className="pointer-events-none absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-panel/90 px-4 py-2 text-xs text-ink-soft shadow-panel backdrop-blur">
        Drag a block onto the canvas, then draw a line from its right edge to connect it.
      </p>
    </div>
  );
}

function DeletableEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  selected,
  style,
  markerEnd,
  data,
}) {
  const [hovered, setHovered] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered || selected ? (
            <button
              type="button"
              aria-label="Remove connection"
              onClick={(event) => {
                event.stopPropagation();
                data?.onDelete(id);
              }}
              className="nodrag nopan grid h-6 w-6 place-items-center rounded-full border border-line bg-panel text-ink-faint shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={12} />
            </button>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default function CanvasSurface() {
  return (
    <ReactFlowProvider>
      <Surface />
    </ReactFlowProvider>
  );
}

function EmptyCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div className="text-center">
        <MousePointerClick size={28} className="mx-auto text-ink-faint" />
        <p className="mt-3 text-sm text-ink-soft">Start with a trigger</p>
        <p className="mt-1 text-xs text-ink-faint">
          Pick a webhook or a schedule from the left and setup your workflow.
        </p>
      </div>
    </div>
  );
}