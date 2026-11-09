import { useEffect, useRef, useState } from "react";
import {
  BaseEdge,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  getStraightPath,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react";
import { LessonTrace } from "../../components/lesson-trace";
import { defineLessonScene, resolveLessonFrame } from "../../components/lesson-scene";
import { codeFindings, codeLesson } from "./code-lesson";
import "@xyflow/react/dist/style.css";
import "./code-scene.css";

const lesson = defineLessonScene(codeLesson);
const steps = [
  {
    id: "definition",
    label: "Definition",
    detail: "Where is it defined?",
    summary: "authorize()",
    symbol: "</>",
  },
  {
    id: "context",
    label: "Calls & imports",
    detail: "Where is it used?",
    summary: "checkout → policy",
    symbol: "↗",
  },
  {
    id: "tests",
    label: "Tests",
    detail: "What is checked?",
    summary: "missing grant → deny",
    symbol: "✓",
  },
] as const;
const next = [
  "Choose a question",
  "Follow the calls",
  "Inspect related tests",
  "Review the evidence",
];

function Magnifier() {
  return (
    <svg className="code-demo__lens" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="13" cy="13" r="8" />
      <path d="m19 19 7 7M9 13a4 4 0 0 1 4-4" />
    </svg>
  );
}

type AnchorNode = Node<Record<string, never>, "anchor">;
type StoryLink = Edge<{ moving: boolean; active: boolean; duration: string }, "story">;

function Anchor() {
  return (
    <div className="code-demo__anchor">
      <Handle id="left-in" type="target" position={Position.Left} />
      <Handle id="right-out" type="source" position={Position.Right} />
      <Handle id="bottom-out" type="source" position={Position.Bottom} />
      <Handle id="top-in" type="target" position={Position.Top} />
    </div>
  );
}
function StoryLinkView(props: EdgeProps<StoryLink>) {
  const [path] = getStraightPath(props);
  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={props.markerEnd}
        className={`code-demo__edge${props.data?.active ? " is-active" : ""}`}
      />
      {props.data?.moving && props.data.active && (
        <g className="code-demo__packet" aria-hidden="true">
          <rect x="-6" y="-6" width="12" height="12" rx="2" />
          <path d="M-3-2h6M-3 1h6M-3 4h4" />
          <animateMotion path={path} dur={props.data.duration} repeatCount="indefinite" />
        </g>
      )}
    </>
  );
}
const nodeTypes = { anchor: Anchor };
const edgeTypes = { story: StoryLinkView };

/** Measure the HTML grid rather than asking a graph viewport to shrink its contents. */
function CodeConnections({ phase, moving }: { readonly phase: number; readonly moving: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<AnchorNode[]>([]);
  useEffect(() => {
    const layer = ref.current;
    const scene = layer?.parentElement;
    if (!layer || !scene) return;
    let request = 0;
    const measure = () => {
      cancelAnimationFrame(request);
      request = requestAnimationFrame(() => {
        const origin = layer.getBoundingClientRect();
        const boxes = [...scene.querySelectorAll<HTMLElement>("[data-code-object]")];
        const work = scene.querySelector<HTMLElement>(".code-demo__work");
        if (!work || boxes.length !== steps.length) return;
        const measured: AnchorNode[] = boxes.map((box) => {
          const rect = box.getBoundingClientRect();
          return {
            id: box.dataset.codeObject!,
            type: "anchor",
            position: { x: rect.left - origin.left, y: rect.top - origin.top },
            data: {},
            style: { width: rect.width, height: rect.height },
            draggable: false,
            selectable: false,
            focusable: false,
          };
        });
        if (phase > 0) {
          const source = boxes[phase - 1].getBoundingClientRect();
          measured.push({
            id: "finding-entry",
            type: "anchor",
            position: {
              x: source.left + source.width / 2 - origin.left,
              y: work.getBoundingClientRect().bottom - origin.top - 8,
            },
            data: {},
            style: { width: 1, height: 1 },
            draggable: false,
            selectable: false,
            focusable: false,
          });
        }
        setNodes(measured);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    scene
      .querySelectorAll<HTMLElement>("[data-code-object], .code-demo__work")
      .forEach((element) => observer.observe(element));
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(request);
    };
  }, [phase]);
  const frame = resolveLessonFrame(lesson, phase, 800, 135);
  const edges: StoryLink[] = frame.relations.map((relation) => ({
    id: relation.id,
    source: relation.source,
    target: relation.target,
    sourceHandle: "right-out",
    targetHandle: "left-in",
    type: "story",
    markerEnd: { type: MarkerType.ArrowClosed, width: 9, height: 9, color: "#9fcfc6" },
    data: { moving, active: relation.status === "active", duration: "1.4s" },
  }));
  if (phase > 0 && nodes.some((node) => node.id === "finding-entry"))
    edges.push({
      id: "finding-transfer",
      source: steps[phase - 1].id,
      target: "finding-entry",
      sourceHandle: "bottom-out",
      targetHandle: "top-in",
      type: "story",
      markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: "#a6ded0" },
      data: { moving, active: true, duration: "0.9s" },
    });
  return (
    <div className="code-demo__graph" ref={ref}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        autoPanOnNodeFocus={false}
      />
    </div>
  );
}

/** A staged illustration. The example files and findings are not live search results. */
export function CodeScene({ phase, moving }: { readonly phase: number; readonly moving: boolean }) {
  const active = Math.max(0, phase - 1);
  const finding = codeFindings[phase];
  const frame = resolveLessonFrame(lesson, phase, 800, 135);
  return (
    <div className="code-demo" data-moving={moving}>
      <div className="code-demo__scene">
        <div className="code-demo__question">
          <span>QUESTION</span>
          <strong>Where is this action authorized?</strong>
        </div>
        <div className="code-demo__work">
          <div className="code-demo__heading">
            <span>01</span>
            <strong>Investigate the code</strong>
          </div>
          <div className="code-demo__steps">
            {steps.map((step, index) => {
              const current = phase > 0 && index === active;
              const done = phase > index + 1;
              const upcoming = phase === 0 || index > active;
              return (
                <div
                  key={step.id}
                  className={`code-demo__column${current ? " is-current" : ""}${done ? " is-done" : ""}${upcoming ? " is-upcoming" : ""}`}
                >
                  <div className="code-demo__object" data-code-object={step.id}>
                    {current && <Magnifier />}
                    <span className="code-demo__icon" aria-hidden="true">
                      {step.symbol}
                    </span>
                    <strong>{step.label}</strong>
                    <small>{upcoming ? step.detail : step.summary}</small>
                    {done && (
                      <span className="code-demo__done" aria-label="Reviewed">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`code-demo__evidence${finding ? " has-finding" : ""}`}>
          <div className="code-demo__heading">
            <span>02</span>
            <strong>What we found</strong>
            <small>ILLUSTRATIVE</small>
          </div>
          {finding ? (
            <div className="code-demo__result" key={finding.source}>
              <span className="code-demo__file-icon" aria-hidden="true">
                ▤
              </span>
              <div>
                <strong>{finding.file}</strong>
                <p>{finding.detail}</p>
              </div>
              <span className="code-demo__result-label">FOUND</span>
            </div>
          ) : (
            <p className="code-demo__empty">A question gives the investigation a starting point.</p>
          )}
          <div className="code-demo__next">
            <span>↳</span> {next[phase]}
          </div>
        </div>
        <CodeConnections phase={phase} moving={moving} />
      </div>
      <LessonTrace teaching={frame.teaching} />
    </div>
  );
}
