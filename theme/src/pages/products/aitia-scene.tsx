import { useEffect, useRef, useState } from "react";
import { MarkerType, ReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { defineLessonScene, resolveLessonFrame } from "../../components/lesson-scene";
import {
  LessonPorts,
  TeachingRelation,
  type TeachingEdge,
} from "../../components/lesson-relations";
import { LessonTrace } from "../../components/lesson-trace";
import { aitiaLesson } from "./aitia-lesson";
import serviceAsset from "../../assets/lesson-service-v1.png";
import taskAsset from "../../assets/lesson-task-v1.png";
import "@xyflow/react/dist/style.css";
import "./aitia-scene.css";

type LessonObject = Node<
  { asset: string; state: string; current: boolean; media?: { src: string; alt: string } },
  "object"
>;

function SceneObjectContent({ data }: NodeProps<LessonObject>) {
  if (data.media)
    return (
      <span className={`aitia-object--media is-${data.asset} state-${data.state}`}>
        <img src={data.media.src} alt={data.media.alt} />
        <span className="aitia-object__name">
          {data.asset === "service"
            ? "Job runner"
            : data.asset === "incoming"
              ? "New job"
              : "Running job"}
        </span>
        {data.state === "inspecting" && <i className="aitia-object__scan" />}
        {data.state === "running" && (
          <i className="aitia-object__running" aria-hidden="true">
            RUNNING
          </i>
        )}
      </span>
    );
  if (data.asset === "service")
    return (
      <div
        className={`aitia-object aitia-object--service${data.state === "inspecting" ? " is-examined" : ""}`}
      >
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <path d="M11 19 40 7l29 12v36L40 72 11 55z" />
          <path d="M11 19 40 35l29-16M40 35v37M25 26v16M55 26v16" />
          <circle cx="40" cy="22" r="3" />
        </svg>
        {data.state === "inspecting" && <span className="aitia-object__scan" />}
      </div>
    );
  if (data.asset === "gate")
    return (
      <div
        className={`aitia-object aitia-object--gate${data.state === "closed" ? " is-closed" : ""}`}
      >
        <span className="aitia-object__gate-label">ENTRY</span>
        <span className="aitia-object__gate-door" aria-hidden="true" />
        <span className="aitia-object__gate-state">
          {data.state === "closed" ? "CLOSED" : "OPEN"}
        </span>
      </div>
    );
  if (data.asset === "finding")
    return (
      <div className="aitia-object aitia-object--finding">
        <svg viewBox="0 0 40 48" aria-hidden="true">
          <path d="M5 3h20l10 10v31H5zM25 3v11h10M12 23h16M12 29h12M12 35h9" />
          <circle cx="28" cy="34" r="8" />
          <path d="M28 30v5M28 38h.01" />
        </svg>
        <span className="aitia-object__name">Host gap</span>
      </div>
    );
  if (data.asset === "review")
    return (
      <div className="aitia-object aitia-object--review">
        <span aria-hidden="true">↶</span>
        <strong>Design review</strong>
        <small>Revisit assumptions</small>
      </div>
    );
  if (data.asset === "model")
    return (
      <div className="aitia-object aitia-object--model">
        <strong>Model check</strong>
        <span>Running?</span>
        <b>WAIT</b>
      </div>
    );
  if (data.asset !== "incoming" && data.asset !== "admitted") return null;
  return (
    <div
      className={`aitia-object aitia-object--job ${data.asset === "incoming" ? "is-incoming" : "is-admitted"}${data.state === "held" && data.asset === "incoming" ? " is-held" : ""}${data.state === "accounted" && data.asset === "admitted" ? " is-accounted" : ""}`}
    >
      <span>{data.asset === "admitted" && data.state === "accounted" ? "✓" : ""}</span>
    </div>
  );
}
function SceneObject(props: NodeProps<LessonObject>) {
  return (
    <div className={`aitia-object-frame${props.data.current ? " is-current" : ""}`}>
      <SceneObjectContent {...props} />
      <LessonPorts />
    </div>
  );
}
const nodeTypes = { object: SceneObject };
const edgeTypes = { teaching: TeachingRelation };
const illustratedLesson = {
  ...defineLessonScene(aitiaLesson),
  assets: {
    service: { src: serviceAsset, alt: "" },
    incoming: { src: taskAsset, alt: "" },
    admitted: { src: taskAsset, alt: "" },
  },
};
/** Illustrative teaching scene: React Flow positions objects, not workflow boxes. */
export function AitiaScene({
  phase,
  moving,
}: {
  readonly phase: number;
  readonly moving: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(680);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const compact = width < (illustratedLesson.compactBelow ?? 480);
  const height = compact ? (phase >= 4 ? 610 : phase >= 2 ? 490 : 325) : phase >= 2 ? 365 : 205;
  const y = compact ? 87 : 105;
  const frame = resolveLessonFrame(illustratedLesson, phase, width, y);
  const nodes: LessonObject[] = frame.actors.map((actor) => ({
    id: actor.id,
    type: "object",
    position: { x: actor.x, y: actor.y },
    data: {
      asset: actor.asset,
      state: actor.state,
      current: frame.teaching.actors.includes(actor.id),
      media: actor.media,
    },
    draggable: false,
    selectable: false,
    focusable: false,
  }));
  const edges: TeachingEdge[] = frame.relations.map((relation) => ({
    id: relation.id,
    source: relation.source,
    target: relation.target,
    sourceHandle: `${relation.anchors.source}-out`,
    targetHandle: `${relation.anchors.target}-in`,
    type: "teaching",
    selectable: false,
    ariaLabel: `${relation.label}${relation.status === "blocked" ? ", entry closed" : ""}`,
    markerEnd:
      relation.status === "blocked"
        ? undefined
        : {
            type: MarkerType.ArrowClosed,
            width: compact ? 8 : 11,
            height: compact ? 8 : 11,
            color:
              relation.kind === "feedback"
                ? "#d9adce"
                : relation.status === "active"
                  ? "#a7dfd3"
                  : "#76969f",
          },
    data: {
      status: relation.status,
      kind: relation.kind,
      moving,
      route: relation.route,
    },
  }));
  return (
    <div className="aitia-lesson" data-phase={phase} data-moving={moving} ref={ref}>
      <div className="aitia-lesson__stage" style={{ height }}>
        <div className="aitia-lesson__lanes" data-phase={phase} aria-hidden="true">
          <div>
            <span>
              <b>01</b> Service operation
            </span>
          </div>
          <div className={phase >= 2 ? "is-visible" : ""}>
            <span>
              <b>02</b> Evidence &amp; review
            </span>
          </div>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
      <LessonTrace teaching={frame.teaching} />
    </div>
  );
}
