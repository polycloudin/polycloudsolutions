"use client";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { PipelineStage } from "../data/types";

function StageNode({ data }: { data: { label: string; count: number; pct?: string; isFirst?: boolean; isLast?: boolean } }) {
  return (
    <div className="rounded-lg border border-[var(--color-line)] bg-white shadow-sm px-4 py-3 min-w-[200px] max-w-[240px]">
      {!data.isFirst && (
        <Handle type="target" position={Position.Left} style={{ background: "#1A5FD4", width: 8, height: 8 }} />
      )}
      <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">
        {data.label}
      </p>
      <p className="text-display text-[1.55rem] leading-none mb-1">{data.count.toLocaleString()}</p>
      {data.pct && (
        <p className="mono text-[10px] text-[#15803D] font-medium">{data.pct}</p>
      )}
      {!data.isLast && (
        <Handle type="source" position={Position.Right} style={{ background: "#1A5FD4", width: 8, height: 8 }} />
      )}
    </div>
  );
}

const nodeTypes: NodeTypes = { stage: StageNode };

function InnerFlow({ stages }: { stages: PipelineStage[] }) {
  // Horizontal flow: each stage 280px apart.
  const nodes: Node[] = stages.map((s, i) => {
    const prev = i > 0 ? stages[i - 1].count : null;
    const pct = prev !== null && prev > 0 ? `${Math.round((s.count / prev) * 100)}% of previous` : undefined;
    return {
      id: `s${i}`,
      type: "stage",
      position: { x: i * 280, y: 40 },
      data: {
        label: s.stage,
        count: s.count,
        pct,
        isFirst: i === 0,
        isLast: i === stages.length - 1,
      },
      draggable: false,
    };
  });

  const edges: Edge[] = stages.slice(1).map((_, i) => ({
    id: `e${i}`,
    source: `s${i}`,
    target: `s${i + 1}`,
    animated: true,
    style: { stroke: "#1A5FD4", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#1A5FD4" },
  }));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll={false}
      zoomOnPinch
      minZoom={0.4}
      maxZoom={1.3}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E5E5" />
    </ReactFlow>
  );
}

export default function PipelineFlow({ stages }: { stages: PipelineStage[] }) {
  if (stages.length === 0) return null;
  return (
    <div className="relative rounded-xl border border-[var(--color-line)] bg-white overflow-hidden h-[260px]">
      <div className="absolute top-3 left-3 z-10 mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] px-2 py-1 rounded bg-white/80 backdrop-blur border border-[var(--color-line)]">
        Funnel · Pan / pinch
      </div>
      <ReactFlowProvider>
        <InnerFlow stages={stages} />
      </ReactFlowProvider>
    </div>
  );
}
