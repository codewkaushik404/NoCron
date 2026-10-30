import { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import { useRecoilValue } from "recoil";
import { MousePointerClick, Trash2 } from "lucide-react";

import { nodesState, edgesState } from "../../state/atoms.js";
import { useWorkflow } from "../../state/useWorkflow.js";
import { nodeTypes } from "./nodeTypes.js";

const defaultEdgeOptions = {
  type: "deletable",
  style: {
    stroke: "#aaa398",
    strokeWidth: 1.5,
  },
};

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

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [addNode, screenToFlowPosition],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      className="canvas-surface relative flex-1 overflow-hidden"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges.map((edge) => ({
          ...edge,
          data: {
            ...edge.data,
            onDelete: removeEdge,
          },
        }))}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => selectNode(null)}
        onEdgeClick={() => selectNode(null)}
        onEdgesDelete={(deletedEdges) => {
          deletedEdges.forEach((edge) => removeEdge(edge.id));
        }}
        edgeTypes={{ deletable: DeleteTableEdge }}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView={nodes.length > 0}
        fitViewOptions={{
          padding: 0.45,
          minZoom: 0.55,
          maxZoom: 0.85,
        }}
        defaultViewport={{
          x: 180,
          y: 80,
          zoom: 0.68,
        }}
        minZoom={0.35}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#c7c1b6"
        />

        <Controls
          position="bottom-left"
          showZoom
          showFitView
          showInteractive={false}
        />
      </ReactFlow>

      {nodes.length === 0 ? <EmptyCanvas /> : null}

      {nodes.length === 0 
      ?  (<div className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-full border border-line bg-panel/90 px-4 py-2 text-xs text-ink-faint shadow-panel backdrop-blur">
        Add a webhook, then stack actions vertically in sequence.
      </div>)
      : null}
    </div>
  );
}

function DeleteTableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  style,
  markerEnd,
  data,
}) {
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? "#b9573f" : "#aaa398",
          strokeWidth: selected ? 2 : 1.5,
        }}
      />

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
                data?.onDelete?.(id);
              }}
              className="nodrag nopan grid h-5 w-5 place-items-center rounded-full border border-line bg-panel text-ink-faint shadow-panel hover:border-cyan hover:text-cyan"
            >
              <Trash2 size={11} />
            </button>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

function EmptyCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div className="text-center">
        <MousePointerClick size={26} className="mx-auto text-ink-faint" />

        <p className="mt-3 text-sm text-ink-soft">
          Start with a webhook trigger
        </p>

        <p className="mt-1 text-xs text-ink-faint">
          Add actions to build a simple linear workflow.
        </p>
      </div>
    </div>
  );
}

export default function CanvasSurface() {
  return (
    <ReactFlowProvider>
      <Surface />
    </ReactFlowProvider>
  );
}
