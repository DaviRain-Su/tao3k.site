import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react";
import { createHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import scheme from "@shikijs/langs/scheme";
import catppuccinMocha from "@shikijs/themes/catppuccin-mocha";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  openPrinciplesFlowSession,
  type PrinciplesFlowEdge,
  type PrinciplesFlowModel,
  type PrinciplesFlowNode,
  type PrinciplesFlowSession,
} from "./principles-flow-model";
import type { WorkflowCursorSnapshot } from "@poo-flow/runtime-wasm";
import { PrinciplesFlowNodeView } from "./principles-flow-node";
import { ProofExplorer } from "./proof-explorer";
import schemeSource from "./human-capability.ss?raw";
import "./principles-flow.css";

const nodeTypes: NodeTypes = { principle: PrinciplesFlowNodeView };
const fitOptions = { padding: 0.16, duration: 520, maxZoom: 1.05 } as const;
const schemeHighlighter = createHighlighterCore({
  langs: [scheme],
  themes: [catppuccinMocha],
  engine: createJavaScriptRegexEngine(),
});

const executionStateLabel = {
  waiting: "blocked",
  ready: "eligible",
  running: "checking",
  complete: "admitted",
} as const;

function PrinciplesFlowCanvas({
  focusedEvidenceId,
  onGraphFocusChange,
}: {
  focusedEvidenceId?: string;
  onGraphFocusChange?: (graphId: string) => void;
}) {
  const [model, setModel] = useState<PrinciplesFlowModel>();
  const [cursor, setCursor] = useState<WorkflowCursorSnapshot>({
    completedSteps: 0,
    stepCount: 0,
  });
  const [selectedId, setSelectedId] = useState<string>();
  const [pinnedNodeId, setPinnedNodeId] = useState<string>();
  const [running, setRunning] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionPulse, setMotionPulse] = useState(0);
  const autoStarted = useRef(false);
  const [overview, setOverview] = useState(true);
  const [cameraMode, setCameraMode] = useState<"follow" | "fit">("follow");
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 620px)").matches,
  );
  const workflowRef = useRef<HTMLDivElement>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceHtml, setSourceHtml] = useState<string>();
  const [error, setError] = useState<string>();
  const sessionRef = useRef<PrinciplesFlowSession | undefined>(undefined);
  const { fitView, setCenter } = useReactFlow<PrinciplesFlowNode, PrinciplesFlowEdge>();

  useEffect(() => {
    let disposed = false;
    void openPrinciplesFlowSession()
      .then((session) => {
        if (disposed) {
          session.release();
          return;
        }
        sessionRef.current = session;
        setModel(session.model);
        setCursor(session.cursor.position());
        setSelectedId(
          session.model.nodes.find(({ data }) => data.semanticId === "human-capability")?.id,
        );
      })
      .catch((reason: unknown) => {
        if (!disposed) setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      disposed = true;
      sessionRef.current?.release();
      sessionRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!sourceOpen) return;
    let disposed = false;
    void schemeHighlighter
      .then((highlighter) =>
        highlighter.codeToHtml(schemeSource, { lang: "scheme", theme: "catppuccin-mocha" }),
      )
      .then((html) => {
        if (!disposed) setSourceHtml(html);
      })
      .catch((reason: unknown) => {
        if (!disposed) setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      disposed = true;
    };
  }, [sourceOpen]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 620px)");
    const update = () => setCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!model || !overview) return;
    // Let React Flow measure the newly switched node set before fitting it.
    const timer = window.setTimeout(() => void fitView({ ...fitOptions, duration: 0 }), 120);
    return () => window.clearTimeout(timer);
  }, [fitView, model, overview, compact]);

  useEffect(() => {
    const element = workflowRef.current;
    if (!model || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (
          entry.isIntersecting &&
          !autoStarted.current &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          autoStarted.current = true;
          setRunning(true);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [model]);

  useEffect(() => {
    if (
      !overview ||
      !running ||
      !inView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setMotionPulse(0);
      return;
    }
    let frame = 0;
    let start = 0;
    const animate = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / 850, 1);
      setMotionPulse(Math.sin(progress * Math.PI));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [cursor.completedSteps, overview, running, inView]);

  useEffect(() => {
    if (!model || !focusedEvidenceId) return;
    const node = model.nodes.find(
      ({ id, data }) => id === focusedEvidenceId || data.semanticId === focusedEvidenceId,
    );
    if (!node || node.id === selectedId) return;
    setSelectedId(node.id);
    setPinnedNodeId(node.id);
    setOverview(false);
    const width = typeof node.style?.width === "number" ? node.style.width : 320;
    const height = typeof node.style?.height === "number" ? node.style.height : 176;
    const frame = requestAnimationFrame(
      () =>
        void setCenter(node.position.x + width / 2, node.position.y + height / 2, {
          duration: 520,
          zoom: 1,
        }),
    );
    return () => cancelAnimationFrame(frame);
  }, [focusedEvidenceId, model, selectedId, setCenter]);

  const step = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    const current = session.cursor.position();
    if (current.completedSteps >= current.stepCount) {
      if (overview) setCursor(session.cursor.reset());
      else setRunning(false);
      return;
    }
    const snapshot = session.cursor.step();
    setCursor(snapshot);
    if (!overview && snapshot.completedSteps >= snapshot.stepCount) setRunning(false);
  }, [overview]);

  useEffect(() => {
    if (!running || !inView) return;
    const interval = window.setInterval(step, 1800);
    return () => window.clearInterval(interval);
  }, [running, inView, step]);

  const toggleRun = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    setPinnedNodeId(undefined);
    if (running) {
      setRunning(false);
      return;
    }
    if (cursor.completedSteps >= session.cursor.stepCount) {
      setCursor(session.cursor.reset());
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  }, [cursor.completedSteps, running]);

  const nodes = useMemo(
    () =>
      model?.nodes.map((node) => ({
        ...node,
        selected: node.id === selectedId,
        data: {
          ...node.data,
          status:
            node.data.order <= cursor.completedSteps
              ? ("complete" as const)
              : node.data.order === cursor.completedSteps + 1 && running
                ? ("running" as const)
                : node.data.order === cursor.completedSteps + 1
                  ? ("ready" as const)
                  : ("waiting" as const),
        },
      })) ?? [],
    [cursor.completedSteps, model, running, selectedId],
  );

  const nodeOrder = useMemo(
    () => new Map(model?.nodes.map(({ id, data }) => [id, data.order]) ?? []),
    [model],
  );
  const edges = useMemo(
    () =>
      model?.edges.map((edge) => {
        const sourceOrder = nodeOrder.get(edge.source) ?? Number.MAX_SAFE_INTEGER;
        const targetOrder = nodeOrder.get(edge.target) ?? Number.MAX_SAFE_INTEGER;
        const complete =
          sourceOrder <= cursor.completedSteps && targetOrder <= cursor.completedSteps;
        const active =
          running &&
          sourceOrder <= cursor.completedSteps &&
          targetOrder === cursor.completedSteps + 1;
        const ready =
          !running &&
          sourceOrder <= cursor.completedSteps &&
          targetOrder === cursor.completedSteps + 1;
        return {
          ...edge,
          animated: running && active,
          className: complete
            ? "is-complete"
            : active
              ? "is-active"
              : ready
                ? "is-ready"
                : "is-waiting",
          label: complete ? "admitted" : active ? "checking" : ready ? "eligible" : "blocked",
          labelBgPadding: [6, 4] as [number, number],
          labelBgBorderRadius: 5,
        };
      }) ?? [],
    [cursor.completedSteps, model, nodeOrder, running],
  );

  // The overview is a labelled conceptual summary; the full view retains the
  // actual Bundle topology and each node's cursor-derived state.
  const overviewIds = ["knowledge", "governed-action", "act", "evidence-return"];
  const groups = [
    ["knowledge", "access", "understand", "compose"],
    ["governed-action", "qualify"],
    ["act"],
    ["evidence-return", "learn"],
  ];
  const stepLabels: Record<string, string> = {
    access: "Access",
    understand: "Understand",
    compose: "Compose",
    qualify: "Qualify",
    learn: "Learn",
  };
  const activeOrder = Math.min(cursor.completedSteps + 1, cursor.stepCount);
  const activeGroup = activeOrder <= 6 ? 0 : activeOrder <= 8 ? 1 : activeOrder === 9 ? 2 : 3;
  const overviewNodes = overviewIds.flatMap((id, index) => {
    const node = nodes.find(({ data }) => data.semanticId === id);
    if (!node) return [];
    const members = nodes.filter(({ data }) => groups[index].includes(data.semanticId));
    const status: PrinciplesFlowNode["data"]["status"] = members.some(
      ({ data }) => data.status === "running",
    )
      ? "running"
      : members.every(({ data }) => data.status === "complete")
        ? "complete"
        : members.some(({ data }) => data.status === "ready")
          ? "ready"
          : "waiting";
    const overviewSteps = members
      .filter(({ data }) => stepLabels[data.semanticId])
      .map(({ data }) => ({ label: stepLabels[data.semanticId], status: data.status }));
    return [
      {
        ...node,
        data: {
          ...node.data,
          status,
          overviewSteps,
          overviewDirection: compact ? "grid" : "horizontal",
          overviewTarget: compact
            ? ["left", "left", "top", "right"][index]
            : ["left", "left", "left", "right"][index],
          overviewSource: compact
            ? ["right", "bottom", "left", "bottom"][index]
            : ["right", "right", "bottom", "left"][index],
          overviewTitle: ["Knowledge", "Qualification", "Human action", "Evidence return"][index],
        },
        position: compact
          ? {
              x: [0, 175, 175, 0][index] + (index === activeGroup ? motionPulse * 8 : 0),
              y: (index < 2 ? 0 : 130) + (index === activeGroup ? -motionPulse * 8 : 0),
            }
          : {
              x: [0, 220, 440, 220][index] + (index === activeGroup ? motionPulse * 20 : 0),
              y: (index === 3 ? 146 : 0) + (index === activeGroup ? -motionPulse * 16 : 0),
            },
        initialWidth: compact ? 158 : 192,
        initialHeight: compact ? 100 : 104,
        style: compact ? { width: 158, height: 100 } : { width: 192, height: 104 },
      },
    ];
  });
  const overviewEdges: PrinciplesFlowEdge[] = overviewNodes.slice(1).map((node, index) => {
    const previous = overviewNodes[index];
    const active = node.data.status === "running" || node.data.status === "ready";
    return {
      id: `overview-${previous.id}-${node.id}`,
      source: previous.id,
      target: node.id,
      type: "smoothstep",
      animated: running && active,
      className: active
        ? running
          ? "is-active"
          : "is-ready"
        : node.data.status === "complete"
          ? "is-complete"
          : "is-waiting",
      data: { order: index },
    };
  });

  if (overviewNodes.length === overviewIds.length) {
    const evidence = overviewNodes[overviewNodes.length - 1];
    overviewEdges.push({
      id: "overview-feedback",
      source: evidence.id,
      target: overviewNodes[0].id,
      type: "smoothstep",
      className: "is-return",
      data: { order: overviewNodes.length },
    });
  }

  const runtimeNode =
    nodes.find(({ data }) => data.status === "running") ??
    nodes.find(({ data }) => data.status === "ready");
  const cameraNode =
    nodes.find(({ id }) => id === pinnedNodeId) ??
    runtimeNode ??
    nodes.find(({ data }) => data.order === cursor.completedSteps) ??
    nodes[0];
  const cameraNodeId = cameraNode?.id;
  useEffect(() => {
    if (overview || cameraMode !== "follow" || !model || !cameraNodeId) return;
    const node = model.nodes.find(({ id }) => id === cameraNodeId);
    if (!node) return;
    const width = typeof node.style?.width === "number" ? node.style.width : 320;
    const height = typeof node.style?.height === "number" ? node.style.height : 176;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(
      () =>
        void setCenter(node.position.x + width / 2, node.position.y + height / 2, {
          duration: reduced ? 0 : 600,
          zoom: compact ? 0.86 : 0.94,
        }),
    );
    return () => cancelAnimationFrame(frame);
  }, [cameraNodeId, cameraMode, compact, model, overview, setCenter]);

  const inspectorNode =
    nodes.find(({ id }) => id === pinnedNodeId) ??
    runtimeNode ??
    nodes.find(({ data }) => data.order === cursor.completedSteps) ??
    nodes.find(({ id }) => id === selectedId) ??
    nodes[0];
  const inboundNodes =
    inspectorNode && model
      ? model.nodes.filter(({ id }) =>
          model.edges.some((edge) => edge.target === inspectorNode.id && edge.source === id),
        )
      : [];
  const outboundCount =
    inspectorNode && model
      ? model.edges.filter((edge) => edge.source === inspectorNode.id).length
      : 0;
  const transitionExplanation = !inspectorNode
    ? "No transition selected."
    : inboundNodes.length > 1
      ? "AND-join: " +
        inboundNodes.map(({ data }) => data.title).join(" + ") +
        " must each return an admitted receipt."
      : inboundNodes.length === 1
        ? "Serial gate: requires the admitted receipt from " + inboundNodes[0].data.title + "."
        : outboundCount > 1
          ? "Fan-out: once admitted, " +
            outboundCount +
            " downstream transitions may become eligible independently."
          : "Entry gate: this transition starts only after its declared condition is checked.";
  const stateExplanation = !inspectorNode
    ? ""
    : inspectorNode.data.status === "complete"
      ? "Admitted: the declared condition and predecessor receipt are satisfied."
      : inspectorNode.data.status === "running"
        ? "Checking: the declared condition is being evaluated before admission."
        : inspectorNode.data.status === "ready"
          ? "Eligible: predecessor receipts are present; this condition is next for evaluation."
          : "Blocked: waiting for the required predecessor receipt or entry condition.";
  const stepCount = cursor.stepCount || model?.nodes.length || 0;

  if (error) {
    return (
      <div className="tao3k-principles-flow__error" role="alert">
        <strong>Topology unavailable</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="tao3k-principles-flow__loading" aria-live="polite">
        <span />
        Loading the verified capability topology…
      </div>
    );
  }

  return (
    <div className="tao3k-principles-flow__layout">
      <div
        className={`tao3k-principles-flow__workflow ${overview ? "is-overview-mode" : ""}`}
        ref={workflowRef}
      >
        <div className="tao3k-principles-flow__viewbar">
          <div>
            <span>HUMAN CAPABILITY</span>
            <small>{overview ? "Conceptual overview" : "Bundle topology"}</small>
          </div>
          <div className="tao3k-principles-flow__views" aria-label="Diagram controls">
            {overview && (
              <button
                type="button"
                onClick={toggleRun}
                aria-label={running ? "Pause animation" : "Play animation"}
              >
                {running ? "Pause" : "Play"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCameraMode("follow");
                setOverview(!overview);
              }}
            >
              {overview ? "Explore topology ↗" : "← Overview"}
            </button>
          </div>
          {!overview && (
            <div className="tao3k-principles-flow__views" aria-label="Topology framing">
              <button
                type="button"
                aria-pressed={cameraMode === "follow"}
                onClick={() => {
                  setPinnedNodeId(undefined);
                  setCameraMode("follow");
                }}
              >
                Follow step
              </button>
              <button
                type="button"
                aria-pressed={cameraMode === "fit"}
                onClick={() => {
                  setCameraMode("fit");
                  void fitView(fitOptions);
                }}
              >
                Fit all
              </button>
            </div>
          )}
        </div>
        <div className={`tao3k-principles-flow__canvas ${overview ? "is-overview" : ""}`}>
          {overview && (
            <div className="tao3k-capability-layers" aria-hidden="true">
              <div>
                <span className="tao3k-layer-desktop">01 · KNOWLEDGE TO ACTION</span>
                <span className="tao3k-layer-mobile">01 · KNOWLEDGE &amp; QUALIFICATION</span>
              </div>
              <div>
                <span className="tao3k-layer-desktop">02 · EVIDENCE RETURNS</span>
                <span className="tao3k-layer-mobile">02 · ACTION &amp; EVIDENCE</span>
              </div>
            </div>
          )}
          <ReactFlow
            nodes={overview ? overviewNodes : nodes}
            edges={overview ? overviewEdges : edges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => {
              setSelectedId(node.id);
              setPinnedNodeId(node.id);
              setCameraMode("follow");
              onGraphFocusChange?.(node.data.semanticId);
            }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            panOnDrag={false}
            panOnScroll={false}
            preventScrolling={false}
            elevateNodesOnSelect={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            minZoom={overview ? 0.38 : 0.1}
            maxZoom={1.5}
            fitView
            fitViewOptions={fitOptions}
            proOptions={{ hideAttribution: true }}
            aria-label="POO Flow human capability composition"
          >
            <Background variant={BackgroundVariant.Dots} gap={30} size={1} />

            {sourceOpen ? (
              <Panel
                position="top-left"
                className="tao3k-principles-source"
                aria-label="Scheme source code"
              >
                <header>
                  <span>human-capability.ss</span>
                  <button
                    type="button"
                    onClick={() => setSourceOpen(false)}
                    aria-label="Close source code"
                  >
                    Close
                  </button>
                </header>
                {sourceHtml ? (
                  <div
                    className="tao3k-principles-source__highlight"
                    dangerouslySetInnerHTML={{ __html: sourceHtml }}
                  />
                ) : (
                  <p className="tao3k-principles-source__loading">Highlighting Scheme…</p>
                )}
              </Panel>
            ) : null}
          </ReactFlow>
        </div>
        {!overview && (
          <div className="tao3k-principles-flow__runtime-dock">
            <div className="tao3k-principles-runtime">
              <div>
                <span>WASM CURSOR</span>
                <strong>
                  {String(cursor.completedSteps).padStart(2, "0")} /{" "}
                  {String(stepCount).padStart(2, "0")}
                </strong>
              </div>
              <button type="button" onClick={toggleRun}>
                {running ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={step}
                disabled={running || cursor.completedSteps >= stepCount}
              >
                Step
              </button>
              {!overview && (
                <button
                  type="button"
                  className="tao3k-principles-runtime__source"
                  aria-expanded={sourceOpen}
                  onClick={() => setSourceOpen((value) => !value)}
                >
                  {sourceOpen ? "Hide Scheme" : "Source code"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {inspectorNode ? (
        <aside className="tao3k-principles-inspector">
          <header>
            <span>{pinnedNodeId ? "Pinned inspection" : "Runtime follow"}</span>
            <strong>{executionStateLabel[inspectorNode.data.status]}</strong>
          </header>
          <h3>{inspectorNode.data.title}</h3>
          <p>{inspectorNode.data.summary}</p>
          <details className="tao3k-principles-inspector__details">
            <summary>Details &amp; conditions</summary>
            <dl>
              <div>
                <dt>Human</dt>
                <dd>{inspectorNode.data.human}</dd>
              </div>
              <div>
                <dt>AI</dt>
                <dd>{inspectorNode.data.ai}</dd>
              </div>
              <div>
                <dt>Guard</dt>
                <dd>{inspectorNode.data.guard}</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{stateExplanation}</dd>
              </div>
              <div>
                <dt>Topology</dt>
                <dd>{transitionExplanation}</dd>
              </div>
              <div>
                <dt>Pressure test</dt>
                <dd>{inspectorNode.data.pressureDetail}</dd>
              </div>
            </dl>
          </details>
          <footer>
            <span>{inspectorNode.data.boundary}</span>
            {pinnedNodeId ? (
              <button
                type="button"
                onClick={() => {
                  setPinnedNodeId(undefined);
                  setCameraMode("follow");
                }}
              >
                Follow run
              </button>
            ) : null}
            <strong>{inspectorNode.data.result}</strong>
          </footer>
        </aside>
      ) : null}
    </div>
  );
}

export function PrinciplesFlow() {
  const [focusedEvidenceId, setFocusedEvidenceId] = useState<string>();
  return (
    <section className="tao3k-principles-flow" aria-labelledby="principles-flow-title">
      <header className="tao3k-principles-flow__header">
        <div>
          <p className="tao3k-route-kicker">THE KNOWLEDGE–ACTION INTERFACE</p>
          <h2 id="principles-flow-title">Information is abundant. Agency is not.</h2>
        </div>
        <p>
          Knowledge becomes action through human judgment. Follow the cycle, then explore the
          underlying topology and its evidence.
        </p>
      </header>
      <div className="tao3k-principles-flow__surface">
        <ReactFlowProvider>
          <PrinciplesFlowCanvas
            focusedEvidenceId={focusedEvidenceId}
            onGraphFocusChange={setFocusedEvidenceId}
          />
        </ReactFlowProvider>
      </div>
      <ProofExplorer
        selectedEvidenceId={focusedEvidenceId}
        onSelectEvidence={setFocusedEvidenceId}
      />
    </section>
  );
}
