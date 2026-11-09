import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  Handle,
  Position,
  ReactFlow,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type LiveNodeData = {
  readonly index: string;
  readonly label: string;
  readonly detail: string;
  readonly state: "waiting" | "active" | "complete";
};

type LiveNode = Node<LiveNodeData, "live-evidence">;

const LiveEvidenceNode = memo(function LiveEvidenceNode({ data }: NodeProps<LiveNode>) {
  return (
    <div className={`tao3k-live-node is-${data.state}`}>
      <Handle type="target" position={Position.Left} />
      <span className="tao3k-live-node__index">{data.index}</span>
      <div>
        <small>{data.state}</small>
        <strong>{data.label}</strong>
        <p>{data.detail}</p>
      </div>
      <i aria-hidden="true" />
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

const liveNodeTypes = { "live-evidence": LiveEvidenceNode };

const liveStages = [
  ["01", "Record", "provenance attached"],
  ["02", "Retrieve", "owner resolved"],
  ["03", "Qualify", "authority granted"],
  ["04", "Act", "bounded runtime"],
  ["05", "Receipt", "evidence returned"],
] as const;

const terminalLines = [
  "$ tao3k qualify ./cases/research-to-operation.org",
  "[record] source identity + authorship attached",
  "[retrieve] 12 claims resolved to parser-owned evidence",
  "[qualify] policy and proof envelope accepted",
  "[act] bounded operation dispatched",
  "[receipt] evidence://operation/7f3a returned",
] as const;

const initialLiveNodes: LiveNode[] = liveStages.map(([index, label, detail], stage) => ({
  id: `live-${index}`,
  type: "live-evidence",
  position: { x: stage * 270, y: stage % 2 === 0 ? 30 : 180 },
  data: { index, label, detail, state: stage === 0 ? "active" : "waiting" },
}));

export function LiveEvidenceFlow() {
  const [activeStage, setActiveStage] = useState(0);
  const activeStageRef = useRef(0);
  const [nodes, setNodes, onNodesChange] = useNodesState<LiveNode>(initialLiveNodes);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [running, setRunning] = useState(() => !reducedMotion);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const synchronize = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) setRunning(false);
    };
    reducedMotion.addEventListener("change", synchronize);
    return () => reducedMotion.removeEventListener("change", synchronize);
  }, []);

  const setStage = useCallback(
    (nextStage: number) => {
      activeStageRef.current = nextStage;
      setActiveStage(nextStage);
      setNodes((current) =>
        current.map((node, stage) => ({
          ...node,
          data: {
            ...node.data,
            state: stage < nextStage ? "complete" : stage === nextStage ? "active" : "waiting",
          },
        })),
      );
    },
    [setNodes],
  );

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setStage((activeStageRef.current + 1) % liveStages.length);
    }, 1450);
    return () => window.clearInterval(timer);
  }, [running, setStage]);

  const edges = useMemo<Edge[]>(
    () =>
      liveStages.slice(0, -1).map((_, stage) => ({
        id: `live-edge-${stage}`,
        source: `live-${liveStages[stage][0]}`,
        target: `live-${liveStages[stage + 1][0]}`,
        type: "smoothstep",
        className:
          stage === activeStage - 1 || (activeStage === 0 && stage === liveStages.length - 2)
            ? "is-active"
            : stage < activeStage
              ? "is-complete"
              : "is-waiting",
      })),
    [activeStage],
  );

  return (
    <section className="tao3k-live" aria-labelledby="live-evidence-title">
      <div className="tao3k-live__heading">
        <div>
          <p className="tao3k-section-index">ILLUSTRATION / EVIDENCE CIRCUIT</p>
          <h2 id="live-evidence-title">From evidence to action, and back again.</h2>
        </div>
        <div className="tao3k-live__controls">
          <span>
            <i className={running ? "is-running" : undefined} /> {running ? "RUNNING" : "PAUSED"}
          </span>
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            disabled={reducedMotion}
            aria-pressed={running}
          >
            {running ? "Pause" : "Run"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStage(0);
              if (!reducedMotion) setRunning(true);
            }}
          >
            Replay
          </button>
        </div>
      </div>
      <div className="tao3k-live__surface">
        <ol className="tao3k-live-mobile" aria-label="Evidence circuit stages">
          {liveStages.map(([index, label, detail], stage) => {
            const state =
              stage < activeStage ? "complete" : stage === activeStage ? "active" : "waiting";
            return (
              <li className={`is-${state}`} key={index}>
                <span className="tao3k-live-mobile__marker" aria-hidden="true" />
                <div>
                  <small>
                    {index} / {state}
                  </small>
                  <strong>{label}</strong>
                  <p>{detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={liveNodeTypes}
          onNodesChange={onNodesChange}
          fitView
          fitViewOptions={{ padding: 0.14 }}
          minZoom={0.45}
          maxZoom={1.5}
          panOnScroll
          zoomOnScroll={false}
          onlyRenderVisibleElements
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(173, 188, 229, 0.16)" gap={28} size={1} />
        </ReactFlow>
      </div>
      <div className="tao3k-live-terminal" aria-live="off">
        <div className="tao3k-live-terminal__bar">
          <span />
          <span />
          <span />
          <strong>tao3k://qualification-session</strong>
          <i>EXAMPLE</i>
        </div>
        <pre>
          {terminalLines.slice(0, Math.min(activeStage + 2, terminalLines.length)).join("\n")}
        </pre>
        <div className="tao3k-live-terminal__cursor" aria-hidden="true">
          ▋
        </div>
      </div>
    </section>
  );
}
