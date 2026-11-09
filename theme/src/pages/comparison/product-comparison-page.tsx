import { useEffect, useRef, useState, type CSSProperties } from "react";
import { comparisonTopics, type ComparisonTopicId } from "./comparison-catalog";
import "./product-comparison-page.css";
import { comparisonResearch } from "./comparison-research";
import { AgentComparison, InfrastructureComparison, WeaverComparison } from "./special-comparisons";

function ResearchMatrix({
  name,
  research,
}: {
  name: string;
  research: NonNullable<(typeof comparisonResearch)[ComparisonTopicId]>;
}) {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const matrix = research.matrix;
  if (!matrix) return null;
  const initials = matrix.reference
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <section
      ref={section}
      className="product-comparison__matrix comparison-research"
      data-visible={visible}
    >
      <div className="matrix-heading">
        <div>
          <small>COMPARISON MATRIX</small>
          <h2>See the difference.</h2>
        </div>
        <p>{research.scenario}</p>
      </div>
      <div className="matrix-table-wrap">
        <table className="comparison-matrix">
          <thead>
            <tr>
              <th scope="col">PERSPECTIVE</th>
              <th scope="col">
                <span className="matrix-brand matrix-brand--ours" aria-hidden="true">
                  T
                </span>
                <span>
                  {name}
                  <a href={research.ownSource.url}>Source ↗</a>
                </span>
              </th>
              <th scope="col">
                <span className="matrix-brand" aria-hidden="true">
                  {initials}
                </span>
                <span>
                  {matrix.reference}
                  <a href={research.comparisons[0].source.url}>Source ↗</a>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map(([question, ours, reference], index) => (
              <tr key={question} style={{ "--row-index": index } as CSSProperties}>
                <th scope="row">{question}</th>
                <td data-label={name}>{ours}</td>
                <td data-label={matrix.reference}>{reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="matrix-details">
        <summary>
          Explore the sources and boundaries <span>↗</span>
        </summary>
        <div className="matrix-details__content">
          <h3>{name}</h3>
          <p>{research.ours}</p>
          <a href={research.ownSource.url}>{research.ownSource.name} ↗</a>
          <div className="comparison-research__alternatives">
            {research.comparisons.map((item) => (
              <article key={item.name}>
                <div>
                  <small>REFERENCE</small>
                  <h4>{item.name}</h4>
                  <a href={item.source.url}>{item.source.name} ↗</a>
                </div>
                <div>
                  <p>{item.use}</p>
                  <p>{item.contrast}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="comparison-research__boundary">
            <small>SCOPE OF EVIDENCE</small>
            <p>{research.boundary}</p>
          </div>
        </div>
      </details>
    </section>
  );
}

export function ProductComparisonPage({ id }: { readonly id: ComparisonTopicId }) {
  const topic = comparisonTopics.find((item) => item.id === id)!;
  const infra = id === "infrastructure";
  const agent = id === "agentic-ai-lab";
  const gateway = id === "weaver";
  const research = comparisonResearch[id];
  return (
    <div className="product-comparison">
      <header>
        <p>COMPARISON / {topic.category.toUpperCase()}</p>
        <h1>{infra ? "From configuration to a running system." : `${topic.name}, in context.`}</h1>
        <span>{topic.focus}</span>
        <div>
          <a href={topic.product}>Explore {topic.name} ↗</a>
          <a href="/comparison">All comparisons ↗</a>
        </div>
      </header>
      {infra ? (
        <InfrastructureComparison />
      ) : agent ? (
        <AgentComparison />
      ) : gateway ? (
        <WeaverComparison />
      ) : research ? (
        <ResearchMatrix name={topic.name} research={research} />
      ) : null}
      <section className="product-comparison__next">
        <h2>Explore another comparison.</h2>
        <a href="/comparison">See the comparison index ↗</a>
      </section>
    </div>
  );
}
