import "./products-page.css";
import { comparisonTopics } from "../comparison/comparison-catalog";
import { productCatalog } from "./product-catalog";
import { ProductFacts } from "./product-facts";

const story = [
  {
    number: "01",
    label: "CONTEXT",
    title: "Keep the knowledge behind the work.",
    copy: "A useful answer needs more than a prompt. Context System connects the task to the records and understanding that give it meaning.",
    link: "/products/context-system",
    cta: "Explore Context System",
    marks: ["Sources", "Context", "Work"],
  },
  {
    number: "02",
    label: "COMPOSITION",
    title: "Compose how agents work.",
    copy: "Agentic AI Lab brings modules, profiles, workflows and policies together as inspectable values. Build a strategy, validate its boundaries, then hand it to an execution runtime.",
    link: "/products/agentic-ai-lab",
    cta: "Explore Agentic AI Lab",
    marks: ["Modules", "Policy", "Runtime"],
  },
  {
    number: "03",
    label: "REASONING",
    title: "Know what follows, and why.",
    copy: "MRR gives relations and derivations their context, lineage and admission boundaries. MRR Data supports the physical data plane.",
    link: "/products/meta-relational-reasoning",
    cta: "Explore MRR",
    marks: ["Facts", "Rules", "Evidence"],
  },
] as const;

function ConceptPath({
  marks,
  variant = "",
}: {
  readonly marks: readonly string[];
  readonly variant?: string;
}) {
  return (
    <div
      className={`product-path ${variant}`}
      aria-label={`Conceptual illustration: ${marks.join(", ")}`}
    >
      <div className="product-path__line" aria-hidden="true">
        <i />
      </div>
      {marks.map((mark, i) => (
        <div className="product-path__item" key={mark}>
          <span>0{i + 1}</span>
          <strong>{mark}</strong>
          <b aria-hidden="true">✦</b>
        </div>
      ))}
    </div>
  );
}

export function ProductsPage() {
  return (
    <div className="product-world">
      <section className="product-world__hero">
        <div className="product-world__hero-copy">
          <p className="product-world__eyebrow">OPEN SOURCE / PRODUCTS</p>
          <h1>
            Open foundations for <em>intelligent work.</em>
          </h1>
          <p>
            From context and reasoning to governed action, discover the projects behind the tao3k
            ecosystem. A card stays STATE PENDING until a roadmap record assigns one of the four
            evidence states. A public repository is not an installable product.
          </p>
          <a className="product-world__link" href="#product-registry-title">
            Explore the projects <span aria-hidden="true">↘</span>
          </a>
        </div>
        <div className="product-world__hero-art">
          <div className="product-world__art-header">
            <span>ONE CONNECTED ECOSYSTEM</span>
            <span>OPEN BY DESIGN</span>
          </div>
          <ConceptPath marks={["Context", "Reason", "Act"]} variant="product-path--hero" />
          <p>Different projects. Connected responsibilities.</p>
        </div>
      </section>
      <section
        className="product-comparison-index"
        aria-labelledby="product-comparison-index-title"
      >
        <div>
          <p className="product-world__eyebrow">FIND YOUR COMPARISON</p>
          <h2 id="product-comparison-index-title">Explore by product.</h2>
          <p>See the scope, alternatives and current state of each comparison.</p>
        </div>
        <div>
          <p className="product-comparison-index__hint">Scroll to explore all products ↕</p>
          <section
            className="product-comparison-index__scroll"
            aria-label="Product comparison links"
          >
            <table>
              <thead>
                <tr>
                  <th>Product / platform</th>
                  <th>Area</th>
                  <th>Comparison</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTopics.map((topic) => (
                  <tr key={topic.id}>
                    <th>
                      <a href={topic.product}>{topic.name}</a>
                    </th>
                    <td>{topic.category}</td>
                    <td>
                      <a href={`/comparison/${topic.id}`}>{"View comparison"} ↗</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>
      <section className="product-world__intro" id="production-system-title">
        <p className="product-world__eyebrow">THE IDEA</p>
        <h2>Better intelligence starts with a better foundation.</h2>
        <p>
          Knowledge should keep its origins. Decisions should have context. Actions should remain
          accountable to the people they affect.
        </p>
      </section>
      <div className="product-stories">
        {story.map((item) => (
          <section
            className="product-story"
            id={item.label === "COMPOSITION" ? "agentic-ai-lab" : undefined}
            key={item.number}
          >
            <div className="product-story__copy">
              <p className="product-world__eyebrow">
                {item.number} / {item.label}
              </p>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
              <a className="product-world__link" href={item.link}>
                {item.cta} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="product-story__visual">
              <ConceptPath marks={item.marks} />
              <span className="product-story__visual-note">ILLUSTRATIVE RELATIONSHIP</span>
            </div>
          </section>
        ))}
      </div>
      <section className="product-index" aria-labelledby="product-registry-title">
        <header>
          <p className="product-world__eyebrow">THE OPEN ECOSYSTEM</p>
          <h2 id="product-registry-title">Explore the projects.</h2>
          <p>
            Each card names a role, one of the four roadmap states, where to read the source, and
            what this site does not claim is finished.
          </p>
        </header>
        <div className="product-index__rows">
          {productCatalog.map((product, index) => (
            <article className="product-card" id={product.id} key={product.id}>
              <span className="product-index__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{product.name}</h3>
                <p>{product.role}</p>
              </div>
              <ProductFacts product={product} />
            </article>
          ))}
        </div>
        <p className="product-index__note">
          Explore the wider ecosystem on <a href="https://github.com/tao3k">GitHub ↗</a>.
        </p>
      </section>
      <section className="product-world__next">
        <p className="product-world__eyebrow">FROM FOUNDATION TO APPLICATION</p>
        <h2>
          Start with the problem.
          <br />
          <em>Build the right system.</em>
        </h2>
        <a className="product-world__link" href="/solutions">
          Explore industry solutions <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
