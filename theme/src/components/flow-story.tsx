import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./flow-story.css";

export type StoryNode = {
  readonly id: string;
  readonly role: string;
  readonly title: string;
  readonly detail: string;
  readonly kind: "origin" | "branch" | "check" | "finding";
  readonly column: string;
  readonly row: string;
  readonly icon:
    | "target"
    | "gate"
    | "queue"
    | "verify"
    | "finding"
    | "question"
    | "code"
    | "links"
    | "test";
};
export type StoryEdge = {
  readonly id: string;
  readonly from?: string;
  readonly to?: string;
  readonly path: string;
  readonly tone: "source" | "design" | "evidence" | "feedback";
};
export type StoryPhase = {
  readonly label: string;
  readonly durationMs?: number;
  readonly title: string;
  readonly detail: string;
  readonly notes: readonly string[];
  readonly activeNodes: readonly string[];
  readonly activeEdges: readonly string[];
  readonly transfers?: readonly { readonly edge: string; readonly label: string }[];
};
export type FlowStorySpec = {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly canvasLabel: string;
  readonly caseLabel: string;
  readonly nodes: readonly StoryNode[];
  readonly edges: readonly StoryEdge[];
  readonly phases: readonly StoryPhase[];
  readonly feedback?: string;
  readonly source: string;
  readonly sourceLabel: string;
  readonly caption: string;
};

export function StoryIcon({ name }: { readonly name: StoryNode["icon"] }) {
  const paths: Record<StoryNode["icon"], React.ReactNode> = {
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    gate: (
      <>
        <path d="M5 20V8l7-4 7 4v12M3 20h18M9 20v-7h6v7" />
        <path d="M12 4v4" />
      </>
    ),
    queue: (
      <>
        <path d="M5 6h14M5 12h14M5 18h14" />
        <circle cx="3" cy="6" r=".7" />
        <circle cx="3" cy="12" r=".7" />
        <circle cx="3" cy="18" r=".7" />
      </>
    ),
    verify: (
      <>
        <path d="M12 3 20 6v5c0 5-3 8-8 10-5-2-8-5-8-10V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    finding: (
      <>
        <path d="M12 3 21 12l-9 9-9-9zM12 7v6" />
        <circle cx="12" cy="16.5" r=".5" />
      </>
    ),
    question: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01" />
      </>
    ),
    code: (
      <>
        <path d="M7 3h7l4 4v14H7zM14 3v5h4M10 13l-2 2 2 2M15 13l2 2-2 2" />
      </>
    ),
    links: (
      <>
        <circle cx="5" cy="6" r="2" />
        <circle cx="19" cy="7" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="m7 7 10 0M6 8l5 8M18 9l-5 7" />
      </>
    ),
    test: (
      <>
        <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8" />
        <path d="m10 17 1.5 1.5L15 15" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function FlowStory({
  story,
  renderScene,
}: {
  readonly story: FlowStorySpec;
  readonly renderScene?: (phase: number, moving: boolean) => React.ReactNode;
}) {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const change = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || reduced || story.phases.length < 2) return;
    const timer = window.setTimeout(
      () => setPhase((value) => (value + 1) % story.phases.length),
      story.phases[phase].durationMs ?? 3600,
    );
    return () => window.clearTimeout(timer);
  }, [phase, visible, reduced, story.phases]);
  const current = story.phases[phase];
  const moving = visible && !reduced;
  const revealed = story.phases.slice(0, phase + 1);
  const revealedNodes = new Set(revealed.flatMap((item) => item.activeNodes));
  const revealedEdges = new Set(revealed.flatMap((item) => item.activeEdges));
  return (
    <section
      className="flow-story"
      ref={root}
      data-story={story.id}
      aria-labelledby={`${story.id}-title`}
    >
      <header className="flow-story__heading">
        <div>
          <p>{story.eyebrow}</p>
          <h2 id={`${story.id}-title`}>{story.title}</h2>
          <span>{story.subtitle}</span>
        </div>
      </header>
      <div className="flow-story__stage">
        <div className="flow-story__canvas" data-moving={moving} data-phase={phase}>
          {!renderScene && (
            <div className="flow-story__canvas-head">
              <span>{story.canvasLabel}</span>
              <span>ILLUSTRATIVE SCENARIO</span>
            </div>
          )}
          {renderScene ? (
            renderScene(phase, moving)
          ) : (
            <>
              <div className="flow-story__map">
                <svg
                  className="flow-story__wires"
                  viewBox="0 0 800 260"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {story.edges.map((edge) => (
                    <path
                      key={edge.id}
                      className={`flow-story__wire tone-${edge.tone}${current.activeEdges.includes(edge.id) ? " is-active" : ""}${revealedEdges.has(edge.id) ? "" : " is-upcoming"}`}
                      d={edge.path}
                    />
                  ))}
                  {moving &&
                    current.transfers?.map((transfer, index) => {
                      const edge = story.edges.find((item) => item.id === transfer.edge);
                      if (!edge) return null;
                      const width = Math.max(48, transfer.label.length * 6 + 20);
                      return (
                        <g
                          key={`${phase}-${edge.id}`}
                          className={`flow-story__transfer tone-${edge.tone}`}
                        >
                          <animateMotion
                            path={edge.path}
                            dur="4.6s"
                            begin={`${index * 0.4}s`}
                            repeatCount="indefinite"
                          />
                          <rect x={-width / 2} y="-11" width={width} height="22" rx="11" />
                          <circle cx={-width / 2 + 10} r="2.5" />
                          <text x="4" y="3.5" textAnchor="middle">
                            {transfer.label}
                          </text>
                        </g>
                      );
                    })}
                </svg>
                {story.nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`flow-story__node kind-${node.kind}${current.activeNodes.includes(node.id) ? " is-active" : ""}${revealedNodes.has(node.id) ? "" : " is-upcoming"}`}
                    aria-hidden={!revealedNodes.has(node.id)}
                    style={{ gridColumn: node.column, gridRow: node.row } as CSSProperties}
                  >
                    <span className="flow-story__icon">
                      <StoryIcon name={node.icon} />
                    </span>
                    <div>
                      <small>{node.role}</small>
                      <strong>{node.title}</strong>
                      <span>{node.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flow-story__action" key={phase}>
                <span className="flow-story__action-icon" aria-hidden="true">
                  {current.transfers?.length === 2
                    ? "⑂"
                    : current.activeEdges.some((id) =>
                          story.edges.some((edge) => edge.id === id && edge.tone === "feedback"),
                        )
                      ? "↶"
                      : "↗"}
                </span>
                <span>
                  {current.transfers?.map((transfer) => transfer.label).join("  ·  ") ||
                    current.label}
                </span>
                <i />
                <span>{current.title}</span>
              </div>
              {story.feedback && (
                <div
                  className={`flow-story__feedback${current.activeEdges.some((id) => story.edges.some((edge) => edge.id === id && edge.tone === "feedback")) ? " is-active" : ""}${story.edges.some((edge) => edge.tone === "feedback" && revealedEdges.has(edge.id)) ? "" : " is-upcoming"}`}
                >
                  <span aria-hidden="true">↶</span> {story.feedback}
                </div>
              )}
            </>
          )}
        </div>
        <aside className="flow-story__case">
          <div className="flow-story__case-top">
            <small>{story.caseLabel}</small>
            <span>ILLUSTRATIVE</span>
          </div>
          <p className="flow-story__step">
            0{phase + 1} / {current.label.toUpperCase()}
          </p>
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
          <div className="flow-story__evidence">
            {current.notes.map((note, index) => (
              <div key={note}>
                <small>0{index + 1}</small>
                <span>{note}</span>
              </div>
            ))}
          </div>
          <a href={story.source}>{story.sourceLabel} ↗</a>
        </aside>
      </div>
      <nav className="flow-story__timeline" aria-label="Illustration stages">
        {story.phases.map((item, index) => (
          <button
            type="button"
            key={item.label}
            aria-pressed={phase === index}
            className={phase === index ? "is-active" : ""}
            onClick={() => setPhase(index)}
          >
            <small>0{index + 1}</small>
            {item.label}
          </button>
        ))}
      </nav>
      <p className="flow-story__caption">{story.caption}</p>
    </section>
  );
}
