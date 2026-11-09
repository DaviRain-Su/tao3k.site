import { useEffect, useMemo, useRef, useState } from "react";
import {
  BaseEdge,
  Handle,
  Position,
  ReactFlow,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { StoryIcon, type FlowStorySpec, type StoryNode } from "./flow-story";
import "@xyflow/react/dist/style.css";
import "./story-flow-scene.css";

type SceneNode = Node<{ item: StoryNode; active: boolean; compact: boolean }, "scene">;
type SceneEdge = Edge<{ label: string; moving: boolean; active: boolean }, "scene">;

function SceneNodeView({ data }: NodeProps<SceneNode>) {
  const { item, active, compact } = data;
  return (
    <div className={`story-scene__node kind-${item.kind}${active ? " is-current" : ""}`}>
      <Handle
        type="target"
        position={compact ? Position.Top : Position.Left}
        isConnectable={false}
      />
      <div className="story-scene__node-head">
        <span className="story-scene__glyph" aria-hidden="true">
          <StoryIcon name={item.icon} />
        </span>
        <small>{item.role}</small>
      </div>
      <strong>{item.title}</strong>
      <span>{item.detail}</span>
      <Handle
        type="source"
        position={compact ? Position.Bottom : Position.Right}
        isConnectable={false}
      />
    </div>
  );
}
function SceneEdgeView(props: EdgeProps<SceneEdge>) {
  const [path] = getSmoothStepPath(props);
  const { data } = props;
  return (
    <>
      <BaseEdge path={path} className={`story-scene__edge${data?.active ? " is-current" : ""}`} />
      {data?.active && data.moving && data.label && (
        <g key={`${props.id}-${data.label}`} className="story-scene__parcel" aria-hidden="true">
          <animateMotion path={path} dur="2.3s" repeatCount="indefinite" />
          <rect x="-26" y="-10" width="52" height="20" rx="10" />
          <text textAnchor="middle" y="3">
            {data.label}
          </text>
        </g>
      )}
    </>
  );
}
const nodeTypes = { scene: SceneNodeView };
const edgeTypes = { scene: SceneEdgeView };

/** A read-only, progressively revealed graph, driven by the shared story clock. */
export function StoryFlowScene({
  story,
  phase,
  moving,
  layout,
  heading,
  compactHeights,
  backdrop,
  children,
}: {
  readonly story: FlowStorySpec;
  readonly phase: number;
  readonly moving: boolean;
  readonly layout: (size: {
    width: number;
    nodeWidth: number;
    gap: number;
    compact: boolean;
    phase: number;
  }) => Record<string, { x: number; y: number }>;
  readonly heading: readonly [string, string];
  readonly compactHeights?: readonly number[];
  readonly backdrop?: React.ReactNode;
  readonly children?: React.ReactNode;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const compact = width < 580;
  const current = story.phases[phase];
  const revealed = story.phases.slice(0, phase + 1);
  const revealedNodes = new Set(revealed.flatMap((item) => item.activeNodes));
  const revealedEdges = new Set(revealed.flatMap((item) => item.activeEdges));
  const nodeWidth = compact
    ? Math.max(120, (width - 24) / 2)
    : Math.max(125, Math.min(170, (width - 72) / 4));
  const gap = compact ? 16 : (width - nodeWidth * 4) / 3;
  const positions = layout({ width, nodeWidth, gap, compact, phase });
  const nodes: SceneNode[] = story.nodes
    .filter((item) => revealedNodes.has(item.id))
    .map((item) => ({
      id: item.id,
      type: "scene",
      position: positions[item.id] ?? { x: 0, y: 0 },
      data: { item, active: current.activeNodes.includes(item.id), compact },
      style: { width: nodeWidth },
      draggable: false,
      selectable: false,
    }));
  const edges: SceneEdge[] = story.edges
    .filter((edge) => edge.from && edge.to && revealedEdges.has(edge.id))
    .map((edge) => ({
      id: edge.id,
      source: edge.from!,
      target: edge.to!,
      type: "scene",
      selectable: false,
      data: {
        active: current.activeEdges.includes(edge.id),
        moving,
        label: current.transfers?.find((item) => item.edge === edge.id)?.label ?? "",
      },
    }));
  const defaultViewport = useMemo(() => ({ x: 0, y: 0, zoom: 1 }), []);
  return (
    <div className="story-scene" data-phase={phase} ref={wrapper}>
      <div className="story-scene__heading">
        <span>{heading[0]}</span>
        <span>{heading[1]}</span>
      </div>
      <div
        className="story-scene__graph"
        style={{ height: compact ? (compactHeights?.[phase] ?? 525) : 340 }}
      >
        {backdrop}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={defaultViewport}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          autoPanOnNodeFocus={false}
        />
      </div>
      {children}
    </div>
  );
}
