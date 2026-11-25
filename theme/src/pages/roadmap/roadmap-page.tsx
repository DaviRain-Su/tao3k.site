import "./roadmap-page.css";
const roadmap = [
  {
    state: "STATE PENDING",
    title: "Evidence Foundations",
    systems: "Orgize · ASP · Xiuxian workshop",
    purpose: "Make records, contracts, source identity and projections durable and portable.",
    evidence:
      "60.01 places Org-first records with the evidence-to-action architecture under its available-foundation heading, evidence passports and lifecycle receipts under active construction, learning value and attribution under research frontiers, and an open evidence economy under the long-term horizon. This front itself has no single assigned state.",
    gap: "Rights and quality signals must remain portable across every projection boundary.",
    signal:
      "Evidence survives theme, runtime and organizational handoffs without losing provenance.",
    docs: "Orgize and ASP repositories. Org Zhixing and Wendao are not separate product pages.",
    reviewed: "2026-07-18",
  },
  {
    state: "STATE PENDING",
    title: "Graph and Scientific Intelligence",
    systems: "Evidence-Action Graph Engine · Julia · ScienceResearch",
    purpose: "Make knowledge, code and scientific relationships computable and inspectable.",
    evidence:
      "The roadmap describes inspectable computational meaning, not a larger embedding store. No front-level state is assigned. MRR is the public reasoning repository; Ascent remains an upstream project tao3k does not maintain.",
    gap: "Semantic relations and scientific claims still need shared qualification boundaries.",
    signal: "Knowledge, code and scientific models can be queried through one inspectable graph.",
    docs: "See MRR on the product map",
    reviewed: "2026-07-18",
  },
  {
    state: "STATE PENDING",
    title: "Qualification and Verification",
    systems: "Lean · Julia · ScienceResearch · Agentic AI Lab",
    purpose: "Qualify claims and authority without hiding judgment behind automation.",
    evidence:
      "60.01 describes Lean obligations, contracts, and a separation between qualification, authorization, and verification. It does not assign this front a state. LeanPoo and Cedar POO Spec are public repositories; their cards stay STATE PENDING.",
    gap: "Formal checks must preserve human judgment and operational context.",
    signal: "Authority becomes machine-checkable without becoming opaque or absolute.",
    docs: "See LeanPoo and Cedar POO Spec",
    reviewed: "2026-07-18",
  },
  {
    state: "Long-term Horizon",
    title: "Next-Generation Agent Core",
    systems: "Agentic AI Lab · Marlin Agent Core",
    purpose:
      "Join typed composition with governed execution while preserving evidence and authority.",
    evidence:
      "60.01 names a governed next-generation agent core as a long-term horizon, not a delivery. Agentic AI Lab and Marlin Agent Core are public repositories. The lab does not execute. Marlin is a substrate, not a terminal-user product. Their cards stay STATE PENDING.",
    gap: "Composition, compression, execution and receipts need one governed operational boundary.",
    signal: "A composed case executes through Marlin while preserving evidence and authority.",
    docs: "See Agentic AI Lab and Marlin Agent Core",
    reviewed: "2026-07-18",
  },
  {
    state: "Long-term Horizon",
    title: "Research-to-Operations Continuity",
    systems: "Project owner unassigned",
    purpose: "Create a bidirectional path between research evidence and governed operation.",
    evidence:
      "The ecosystem roadmap lists research-to-operations continuity among long-term horizons. No responsible project is assigned, and operational evidence returning to research is not a delivered path.",
    gap: "Bidirectional promotion and feedback are not yet one continuous enterprise path.",
    signal:
      "A research result can enter governed operation and return outcome evidence to research.",
    docs: "No project documentation destination is assigned",
    reviewed: "2026-07-18",
  },
  {
    state: "Long-term Horizon",
    title: "Technical Equity and Open Infrastructure",
    systems: "Project owner unassigned",
    purpose:
      "Broaden the ability to inspect, learn, contribute and deploy without surrendering agency.",
    evidence:
      "Technical equity and open public foundations are named as long-term horizons. No project owner is assigned, and access is not claimed as already solved.",
    gap: "Access, education and contribution paths must become coherent across the ecosystem.",
    signal:
      "New participants can inspect, learn, contribute and deploy without surrendering agency.",
    docs: "No project documentation destination is assigned",
    reviewed: "2026-07-18",
  },
  {
    state: "Long-term Horizon",
    title: "Evidence-Action Ecosystem",
    systems: "Cross-ecosystem outcome",
    purpose: "Close the lifecycle so every action returns searchable and contestable evidence.",
    evidence:
      "A closed evidence-action lifecycle is named as a long-term horizon. It depends on the earlier fronts and is not scheduled delivery.",
    gap: "The preceding fronts must interoperate before the lifecycle can close at ecosystem scale.",
    signal: "Every action returns searchable, contestable and improvable evidence.",
    docs: "No project documentation destination is assigned",
    reviewed: "2026-07-18",
  },
] as const;

export function RoadmapPage() {
  return (
    <div className="tao3k-roadmap-page">
      <section className="tao3k-roadmap-maturity" aria-labelledby="roadmap-maturity-title">
        <header>
          <span>FOUR EVIDENCE STATES</span>
          <h2 id="roadmap-maturity-title">Dates do not move a frontier. Evidence does.</h2>
          <p>
            Every transition must be earned through a public evidence record. No front receives a
            maturity label merely because work has started or a date has been announced.
          </p>
        </header>
        <ol>
          <li>
            <span>01</span>
            <strong>Available Foundation</strong>
            <p>A reusable capability exists with current evidence.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Active Construction</strong>
            <p>Implementation and integration are underway.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Research Frontier</strong>
            <p>Investigation supports the direction, not an adoption promise.</p>
          </li>
          <li>
            <span>04</span>
            <strong>Long-term Horizon</strong>
            <p>The outcome depends on earlier evidence and is not scheduled delivery.</p>
          </li>
        </ol>
        <p className="tao3k-roadmap-maturity__notice">
          Product cards use these four names for repository evidence. That is not a promotion of a
          roadmap front. Where the roadmap record assigns no front-level state, the front stays
          STATE PENDING.
        </p>
      </section>

      <section className="tao3k-roadmap-lenses" aria-label="Roadmap stakeholder lenses">
        <article className="tao3k-roadmap-lens tao3k-roadmap-lens--enterprise">
          <span>ENTERPRISE READINESS</span>
          <h2>Adoption begins at an evidence boundary.</h2>
          <p>
            A front becomes evaluable only when its state, accountable owner, current evidence,
            known gap, exit criterion, project documentation and review date are public.
          </p>
          <div>
            <strong>Until then</strong>
            <p>Direction is visible, but production readiness is not implied.</p>
          </div>
        </article>
        <article className="tao3k-roadmap-lens tao3k-roadmap-lens--capital">
          <span>LONG-HORIZON VALUE</span>
          <h2>Each foundation increases the value of the next.</h2>
          <p>
            Evidence, graph intelligence, qualification, agent operation and open infrastructure
            compound as one system. Capital supports the dependency chain—not an isolated launch.
          </p>
          <div>
            <strong>What progress means</strong>
            <p>More durable capability, clearer gaps and stronger promotion receipts.</p>
          </div>
        </article>
      </section>

      <section className="tao3k-roadmap-outcome" aria-labelledby="roadmap-outcome-title">
        <span>CONDITIONAL ECOSYSTEM OUTCOME</span>
        <blockquote id="roadmap-outcome-title">
          Evidence qualifies action. Action returns evidence.
        </blockquote>
        <p>
          The lifecycle closes only when the preceding fronts interoperate. Until then, the outcome
          remains a horizon rather than a delivery claim.
        </p>
      </section>
      <section className="tao3k-roadmap-hero">
        <div>
          <p className="tao3k-route-kicker">DEPENDENCY-ORDERED ROADMAP</p>
          <h1>Build trust in the order it depends on.</h1>
        </div>
        <p>
          This is not a promise calendar. Each horizon advances only when the evidence boundary
          beneath it is real, inspectable and reusable.
        </p>
      </section>

      <section className="tao3k-roadmap-track">
        {roadmap.map((item, index) => (
          <article key={item.title} data-state={item.state}>
            <div className="tao3k-roadmap-track__rail">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </div>
            <div className="tao3k-roadmap-track__state">{item.state}</div>
            <div className="tao3k-roadmap-track__body">
              <h2>{item.title}</h2>
              <p>{item.purpose}</p>
              <dl className="tao3k-roadmap-track__evidence">
                <div>
                  <dt>RELATED SYSTEMS</dt>
                  <dd>{item.systems}</dd>
                </div>
                <div>
                  <dt>PUBLIC EVIDENCE</dt>
                  <dd>{item.evidence}</dd>
                </div>
                <div>
                  <dt>KNOWN GAP</dt>
                  <dd>{item.gap}</dd>
                </div>
              </dl>
            </div>
            <div className="tao3k-roadmap-track__signal">
              <span>EXIT SIGNAL</span>
              <p>{item.signal}</p>
              <footer>
                <span>{item.docs}</span>
                <time dateTime={item.reviewed}>60.01 dated {item.reviewed}</time>
              </footer>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
