import { LiveEvidenceFlow } from "../../LiveEvidenceFlow";
import {
  ContextDataStory,
  ContextArchitectureStory,
  ContextIndustryStory,
  ContextScienceStory,
  ContextStructureStory,
} from "./context-stories";
import "./context-system-page.css";

export function ContextSystemPage() {
  return (
    <div className="tao3k-context">
      <section className="tao3k-context__hero">
        <div>
          <p className="tao3k-route-kicker">AI-NATIVE / CONTEXT SYSTEM</p>
          <h1>
            AI work moves fast. <em>Context gets left behind.</em>
          </h1>
          <p>
            Conversations, notes and evidence change every turn. Keep the originals in Org, query
            their structure, and compose context when AI needs it.
          </p>
          <a href="#context-architecture-title">
            See how it works <span aria-hidden="true">↓</span>
          </a>
          <p className="tao3k-context__trust">
            FILE AS DATA · METADATA FOR QUERY · CONTEXT AS A MODEL
          </p>
        </div>
        <div className="tao3k-context__hero-file" aria-label="Illustrative Org record">
          <div>
            <span>YOUR WORKSPACE</span>
            <strong>research.org</strong>
          </div>
          <pre>
            {
              "* Research question\n  Why did this change?\n\n** Evidence\n  [[file:results.csv]]\n\n** Next steps\n  - Review the findings"
            }
          </pre>
          <small>YOUR FILE · YOUR CONTEXT</small>
        </div>
      </section>
      <ContextArchitectureStory />
      <ContextDataStory />
      <ContextStructureStory />
      <section className="tao3k-context__principles" aria-label="Context system design">
        <article>
          <small>01 / SOURCE</small>
          <h2>File as your database.</h2>
          <p>Keep evolving notes, evidence and code in readable, versionable Org files.</p>
        </article>
        <article>
          <small>02 / SELECT</small>
          <h2>Metadata for query.</h2>
          <p>Use document structure and metadata to locate relevant content in its source.</p>
        </article>
        <article>
          <small>03 / COMPOSE</small>
          <h2>Context as a model.</h2>
          <p>
            Compose a task-scoped working view while retaining source and relationship references.
          </p>
        </article>
      </section>
      <ContextScienceStory />
      <ContextIndustryStory />
      <div id="context-flow">
        <LiveEvidenceFlow />
      </div>
      <section className="tao3k-context__note">
        <p className="tao3k-route-kicker">DESIGN IN PROGRESS</p>
        <h2>A shared foundation, built in the open.</h2>
        <p>
          Orgize parses source-backed Org elements and offers selected query surfaces. Scientific
          runtime orchestration and custom kernels are directions for development; the illustrations
          above are not live executions.
        </p>
        <p>
          <a href="https://github.com/tao3k/orgize">Explore Orgize ↗</a> ·{" "}
          <a href="https://orgmode.org/worg/org-contrib/babel/intro.html">About Org Babel ↗</a> ·{" "}
          <a href="https://github.com/emacs-jupyter/jupyter">Org and Jupyter ↗</a>
        </p>
        <a href="https://github.com/tao3k/agentic-ai-lab">Explore Agentic AI Lab on GitHub ↗</a>
      </section>
    </div>
  );
}
