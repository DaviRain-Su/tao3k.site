import { FlowStory } from "../../components/flow-story";
import { aitiaStory } from "../../components/flow-stories";
import { AitiaScene } from "./aitia-scene";
import "./aitia-page.css";

export function AitiaPage() {
  return (
    <article className="aitia">
      <section className="aitia-hero">
        <div>
          <p className="aitia-kicker">PRODUCT / HUMAN + AI ENGINEERING</p>
          <p className="aitia-name">Lambda Aitia</p>
          <h1>Better software begins with better decisions.</h1>
          <p className="aitia-lead">
            A Human + AI framework for the software lifecycle—from understanding and design through
            verification, operation and evolution.
          </p>
          <a className="aitia-link" href="https://github.com/tao3k/lambda-aitia">
            Explore the open source <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="aitia-atlas" aria-label="Illustrative lifecycle with feedback">
          <div className="aitia-atlas__header">
            <span>ONE LIFECYCLE</span>
            <span>HUMAN + AI</span>
          </div>
          <div className="aitia-atlas__ring">
            <div>
              <small>SHARED CONTEXT</small>
              <strong>
                Design
                <br />
                with evidence.
              </strong>
            </div>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </div>
          <div className="aitia-atlas__labels">
            <span>DESIGN</span>
            <span>BUILD</span>
            <span>VERIFY</span>
            <span>LEARN</span>
          </div>
          <p>Each finding can bring a better question back to the design.</p>
        </div>
      </section>
      <FlowStory
        story={aitiaStory}
        renderScene={(phase, moving) => <AitiaScene phase={phase} moving={moving} />}
      />
      <section className="aitia-ecosystem">
        <p className="aitia-kicker">BUILT TO COMPOSE</p>
        <h2>
          Specialized foundations.
          <br />
          <em>A shared engineering purpose.</em>
        </h2>
        <div className="aitia-ecosystem__grid">
          <a href="/products/agentic-ai-lab">
            <small>SEMANTIC COMPOSITION</small>
            <strong>Agentic AI Lab</strong>
            <span>Reusable composition, governance and runtime mechanisms. ↗</span>
          </a>
          <a href="/products/deterministic-engineering">
            <small>ENGINEERING LIBRARY</small>
            <strong>Deterministic Engineering</strong>
            <span>Extensible models, methods and project definitions. ↗</span>
          </a>
          <a href="/products/lambda-episteme">
            <small>DOMAIN KNOWLEDGE</small>
            <strong>Lambda Episteme</strong>
            <span>Optional domain context and vertical scenarios. ↗</span>
          </a>
        </div>
      </section>
      <section className="aitia-status">
        <p className="aitia-kicker">DESIGN DIRECTION / IN DEVELOPMENT</p>
        <h2>Build the lifecycle together.</h2>
        <p>
          The Human + AI SDLC framework and Rust engineering runtime are the current design
          direction. Connected lifecycle qualification and execution boundaries are still being
          developed.
        </p>
        <div>
          <a
            className="aitia-link"
            href="https://github.com/tao3k/lambda-aitia/blob/f06d41825c14530f3bdb62393387c595ba58c52d/docs/rfcs/0004-sdlc-design-and-causal-trajectories.org"
          >
            Read the lifecycle design ↗
          </a>
          <a className="aitia-link" href="https://github.com/tao3k/lambda-aitia/pull/2">
            Follow the open work ↗
          </a>
        </div>
      </section>
    </article>
  );
}
