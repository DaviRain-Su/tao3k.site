import "./solutions-page.css";

const solutions = [
  {
    id: "code-intelligence",
    label: "CODE INTELLIGENCE",
    title: "Agentic code intelligence",
    description: "Find source-backed context for code and agents.",
    href: "/solutions/code-intelligence",
  },
  {
    id: "engineering-assurance",
    label: "ENGINEERING",
    title: "Deterministic engineering",
    description: "Connect engineering questions, evidence and change.",
    href: "/solutions/engineering-assurance",
  },
  {
    id: "domain-knowledge",
    label: "DOMAIN INTELLIGENCE",
    title: "Domain knowledge and reasoning",
    description: "Bring domain context, rules and evidence into decisions.",
    href: "/solutions/domain-knowledge",
  },
  {
    id: "agent-infrastructure",
    label: "AGENT SYSTEMS",
    title: "Composable agent systems",
    description: "Build strategies from modules, profiles and policy.",
    href: "/solutions/composable-agents",
  },
  {
    id: "governed-gateway",
    label: "AGENT CONNECTIVITY",
    title: "Governed AI gateway",
    description: "Keep policy and task identity connected across requests.",
    href: "/solutions/ai-gateway",
  },
  {
    id: "solution-system-title",
    label: "TRUST",
    title: "Trust & authorization",
    description: "Compose authorization for decisions that depend on context.",
    href: "/solutions/trust-authorization",
  },
  {
    id: "privacy",
    label: "PRIVACY",
    title: "Your data. Your choice of model.",
    description: "Keep source data under your control as tools change.",
    href: "/solutions/privacy",
  },
  {
    id: "life-sciences",
    label: "HEALTHCARE",
    title: "The right patient and disclosure",
    description: "Bring identity and privacy into authorization decisions.",
    href: "/solutions/healthcare",
  },
  {
    id: "regulated-operations",
    label: "FINANCIAL SERVICES",
    title: "Independent payment controls",
    description: "Separate responsibilities around consequential actions.",
    href: "/solutions/financial-services",
  },
  {
    id: "linux-hardening",
    label: "SYSTEM SECURITY",
    title: "Linux hardening",
    description: "Harden the system beneath the workload with HardenedLinux.",
    href: "/solutions/linux-hardening",
  },
  {
    id: "security-authorization",
    label: "SECURITY",
    title: "Secure systems in layers",
    description: "Protect the supply chain, govern access and isolate workloads.",
    href: "/solutions/security-identity",
  },
] as const;

export function SolutionsPage() {
  return (
    <div className="solution-world solution-directory">
      <section className="solution-world__hero">
        <div>
          <p className="solution-world__eyebrow">SOLUTIONS / AI INFRASTRUCTURE</p>
          <h1>
            Build AI systems <em>you can govern.</em>
          </h1>
          <p>
            Explore solutions for composing agent systems, connecting their tools and making
            decisions in context.
          </p>
          <a className="solution-world__link" href="#solution-cases">
            Explore solutions <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="solution-world__hero-visual">
          <div>
            <small>OPEN SOURCE FOUNDATION</small>
            <strong>Built for real work</strong>
            <p>From agent infrastructure to domain authorization.</p>
          </div>
        </div>
      </section>
      <section className="solution-directory__list" id="solution-cases">
        <header>
          <p className="solution-world__eyebrow">FIND YOUR STARTING POINT</p>
          <h2>
            Different challenges.
            <br />
            Connected foundations.
          </h2>
        </header>
        <div>
          {[
            { name: "Code & engineering", ids: ["code-intelligence", "engineering-assurance"] },
            { name: "Agent infrastructure", ids: ["agent-infrastructure", "governed-gateway"] },
            {
              name: "Trust & security",
              ids: [
                "privacy",
                "solution-system-title",
                "security-authorization",
                "linux-hardening",
              ],
            },
            {
              name: "Industry solutions",
              ids: ["life-sciences", "regulated-operations", "domain-knowledge"],
            },
          ].map((group) => (
            <section className="solution-directory__group" key={group.name}>
              <h3>{group.name}</h3>
              {group.ids.map((id) => {
                const item = solutions.find((solution) => solution.id === id);
                if (!item) return null;
                return (
                  <a id={item.id} href={item.href} key={item.id}>
                    <span aria-hidden="true">◇</span>
                    <div>
                      <small>{item.label}</small>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <b aria-hidden="true">↗</b>
                  </a>
                );
              })}
            </section>
          ))}
        </div>
      </section>
      <section className="solution-world__next">
        <p className="solution-world__eyebrow">OPEN SOURCE / TAO3K</p>
        <h2>Explore the foundations.</h2>
        <a className="solution-world__link" href="/products">
          Explore products <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
