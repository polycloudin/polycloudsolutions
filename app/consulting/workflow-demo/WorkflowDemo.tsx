"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  MarkerType,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/**
 * Before / after workflow diagrams for a CA firm's month-end close.
 * Two React Flow instances side-by-side on desktop, toggle on mobile.
 * The "After" graph is editable — you can drag nodes and draw new edges,
 * which is the "feels-like-a-real-product" moment that static SVGs can't
 * match.
 */

type NodeKind = "manual" | "automated" | "human-review" | "output" | "pain";

function WorkflowNode({ data }: { data: { label: string; kind: NodeKind; sub?: string; hours?: string } }) {
  const styles: Record<NodeKind, { border: string; bg: string; dot: string; label: string }> = {
    manual: { border: "#D4D4D8", bg: "#FAFAFA", dot: "#A1A1AA", label: "Manual" },
    pain: { border: "#FCA5A5", bg: "#FEF2F2", dot: "#DC2626", label: "Pain point" },
    automated: { border: "#1A5FD4", bg: "#EEF4FF", dot: "#1A5FD4", label: "Autopilot" },
    "human-review": { border: "#B45309", bg: "#FFFBEB", dot: "#B45309", label: "You approve" },
    output: { border: "#15803D", bg: "#ECFDF3", dot: "#15803D", label: "Output" },
  };
  const s = styles[data.kind];
  return (
    <div
      className="rounded-lg border px-3.5 py-2.5 shadow-sm min-w-[170px] max-w-[220px]"
      style={{ borderColor: s.border, backgroundColor: s.bg }}
    >
      <Handle type="target" position={Position.Top} style={{ background: s.dot, width: 7, height: 7 }} />
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
        <span
          className="mono text-[8.5px] uppercase tracking-[0.16em] font-medium"
          style={{ color: s.dot }}
        >
          {s.label}
        </span>
      </div>
      <p className="text-[12.5px] font-medium tracking-tight leading-[1.25] text-[var(--color-ink)]">
        {data.label}
      </p>
      {data.sub && (
        <p className="text-[10.5px] text-[var(--color-text-secondary)] mt-0.5 leading-snug">
          {data.sub}
        </p>
      )}
      {data.hours && (
        <p className="mono text-[10px] text-[var(--color-text-muted)] mt-1">{data.hours}</p>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: s.dot, width: 7, height: 7 }} />
    </div>
  );
}

const nodeTypes: NodeTypes = { wf: WorkflowNode };

// ------------------------------------------------------------------
// BEFORE — how most 4-partner CA firms actually do month-end close
// ------------------------------------------------------------------
const beforeNodes: Node[] = [
  { id: "b1", type: "wf", position: { x: 60, y: 0 },   data: { label: "Client emails Excel + GSTR-2B JSON", kind: "manual", hours: "~0 hrs · just waiting" } },
  { id: "b2", type: "wf", position: { x: 60, y: 140 }, data: { label: "Junior opens in Excel, reformats columns", kind: "manual", hours: "~1.5 hrs / client" } },
  { id: "b3", type: "wf", position: { x: 60, y: 280 }, data: { label: "Manual VLOOKUP on GSTIN + invoice no.", kind: "pain", sub: "Breaks on amended invoices", hours: "~3.5 hrs / client" } },
  { id: "b4", type: "wf", position: { x: 60, y: 430 }, data: { label: "Calls each vendor, asks for missing GSTR-1", kind: "pain", sub: "3–8 calls per client · repeat weekly", hours: "~2.5 hrs / client" } },
  { id: "b5", type: "wf", position: { x: 60, y: 580 }, data: { label: "Emails partner a summary Excel", kind: "manual", hours: "~0.5 hrs / client" } },
  { id: "b6", type: "wf", position: { x: 60, y: 720 }, data: { label: "Partner reviews, edits, signs", kind: "human-review", hours: "~0.5 hrs / client" } },
  { id: "b7", type: "wf", position: { x: 60, y: 860 }, data: { label: "Filed return + client invoice", kind: "output", hours: "8+ hrs total · per client" } },
];
const beforeEdges: Edge[] = [
  { id: "be1", source: "b1", target: "b2" },
  { id: "be2", source: "b2", target: "b3" },
  { id: "be3", source: "b3", target: "b4" },
  { id: "be4", source: "b4", target: "b5" },
  { id: "be5", source: "b5", target: "b6" },
  { id: "be6", source: "b6", target: "b7" },
].map((e) => ({ ...e, animated: false, style: { stroke: "#D4D4D8", strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#D4D4D8" } }));

// ------------------------------------------------------------------
// AFTER — PolyCloud ca-firm-toolkit (GSTR-2B recon + follow-up + OCR)
// ------------------------------------------------------------------
const afterNodes: Node[] = [
  { id: "a1",  type: "wf", position: { x: 40,  y: 0 },   data: { label: "Client WhatsApps GSTR-2B + purchase register", kind: "manual", hours: "~0 hrs · inbound only" } },

  { id: "a2a", type: "wf", position: { x: 40,  y: 140 }, data: { label: "Recon engine matches GSTIN × invoice × amount", kind: "automated", sub: "rapidfuzz + tolerance", hours: "< 30 sec / client" } },
  { id: "a2b", type: "wf", position: { x: 300, y: 140 }, data: { label: "OCR scans any photo'd invoice", kind: "automated", sub: "dots.ocr → Tally XML", hours: "< 5 sec / invoice" } },

  { id: "a3",  type: "wf", position: { x: 40,  y: 290 }, data: { label: "5-sheet Excel + ITC-at-risk flagged", kind: "automated", hours: "automatic" } },
  { id: "a4",  type: "wf", position: { x: 300, y: 290 }, data: { label: "WhatsApp sent to missing-invoice vendors", kind: "automated", sub: "Meta-approved templates", hours: "~0 hrs · queued" } },

  { id: "a5",  type: "wf", position: { x: 170, y: 450 }, data: { label: "Partner reviews flagged items only", kind: "human-review", sub: "ITC-risk > ₹10K · OCR confidence < 90%", hours: "~20 min / client" } },
  { id: "a6",  type: "wf", position: { x: 170, y: 590 }, data: { label: "Filed return + client invoice", kind: "output", hours: "< 1 hr total · per client" } },
];
const afterEdges: Edge[] = [
  { id: "ae1",  source: "a1",  target: "a2a" },
  { id: "ae2",  source: "a1",  target: "a2b" },
  { id: "ae3",  source: "a2a", target: "a3" },
  { id: "ae4",  source: "a2a", target: "a4" },
  { id: "ae5",  source: "a2b", target: "a3" },
  { id: "ae6",  source: "a3",  target: "a5" },
  { id: "ae7",  source: "a4",  target: "a5" },
  { id: "ae8",  source: "a5",  target: "a6" },
].map((e) => ({
  ...e,
  animated: true,
  style: { stroke: "#1A5FD4", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#1A5FD4" },
}));

function BeforeCanvas() {
  return (
    <ReactFlow
      nodes={beforeNodes}
      edges={beforeEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.25 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll={false}
      zoomOnPinch
      minZoom={0.35}
      maxZoom={1.4}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E5E5" />
      <Controls showInteractive={false} className="!border-[var(--color-line)] !rounded-md" />
    </ReactFlow>
  );
}

function AfterCanvas() {
  const [nodes, , onNodesChange] = useNodesState(afterNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(afterEdges);
  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...c,
            animated: true,
            style: { stroke: "#F46B2C", strokeWidth: 1.5, strokeDasharray: "4 4" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#F46B2C" },
          },
          eds
        )
      ),
    [setEdges]
  );
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      nodesDraggable
      nodesConnectable
      elementsSelectable
      panOnDrag
      zoomOnScroll={false}
      zoomOnPinch
      minZoom={0.35}
      maxZoom={1.4}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E5E5" />
      <Controls showInteractive={false} className="!border-[var(--color-line)] !rounded-md" />
    </ReactFlow>
  );
}

export default function WorkflowDemo() {
  const [view, setView] = useState<"before" | "after" | "both">("both");

  const showBefore = view === "before" || view === "both";
  const showAfter = view === "after" || view === "both";

  return (
    <ReactFlowProvider>
      <div className="space-y-4">
        {/* View toggle — mobile: pick one, desktop: side-by-side default */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] mr-1">
            View
          </span>
          {(["before", "after", "both"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`mono text-[10.5px] uppercase tracking-wider px-3 py-1.5 rounded border transition-colors ${
                view === v
                  ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                  : "bg-white text-[var(--color-text-secondary)] border-[var(--color-line)] hover:border-[var(--color-ink)]"
              } ${v === "both" ? "hidden md:inline-flex" : ""}`}
            >
              {v}
            </button>
          ))}
        </div>

        <div
          className={`grid gap-4 md:gap-5 ${
            view === "both" ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {showBefore && (
            <div className="relative rounded-xl border border-[var(--color-line)] bg-white overflow-hidden h-[560px] md:h-[680px]">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] px-2 py-1 rounded bg-white/80 backdrop-blur border border-[var(--color-line)]">
                  Before
                </span>
                <span className="mono text-[10px] text-[var(--color-text-secondary)] px-2 py-1 rounded bg-white/80 backdrop-blur border border-[var(--color-line)]">
                  ~8 hrs / client / month
                </span>
              </div>
              <BeforeCanvas />
            </div>
          )}

          {showAfter && (
            <div className="relative rounded-xl border border-[var(--color-primary-blue)]/30 bg-white overflow-hidden h-[560px] md:h-[680px]">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span
                  className="mono text-[10px] uppercase tracking-[0.2em] text-white px-2 py-1 rounded"
                  style={{ backgroundColor: "#1A5FD4" }}
                >
                  After · PolyCloud
                </span>
                <span
                  className="mono text-[10px] px-2 py-1 rounded"
                  style={{ backgroundColor: "#ECFDF3", color: "#15803D" }}
                >
                  &lt; 1 hr / client / month
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10 hidden md:flex items-center gap-2">
                <span className="mono text-[9.5px] text-[var(--color-text-muted)] px-2 py-1 rounded bg-white/80 backdrop-blur border border-[var(--color-line)]">
                  Drag nodes · draw edges
                </span>
              </div>
              <AfterCanvas />
            </div>
          )}
        </div>

        <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] text-center pt-2">
          Same firm · same clients · same compliance outcome · 8× fewer hours.
        </p>
      </div>
    </ReactFlowProvider>
  );
}
