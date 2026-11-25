/**
 * Roles for projects listed in docs/products/70.02 follow that mapping.
 * 70.02 assigns no four-state maturity. Cards stay STATE PENDING until a
 * roadmap record assigns one of the four states with limits, an exit
 * criterion, and a review date. Weaver, Lambda Episteme, and Deterministic
 * Engineering are not in that mapping.
 */

export const evidenceStates = [
  "Available Foundation",
  "Active Construction",
  "Research Frontier",
  "Long-term Horizon",
] as const;

export type EvidenceState = (typeof evidenceStates)[number] | "STATE PENDING";

export type ProductRecord = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly responsibility: string;
  readonly maturity: EvidenceState;
  readonly maturityNote: string;
  readonly access: string;
  readonly repository?: string;
  readonly docsLabel: string;
  readonly docsHref?: string;
  readonly detailHref?: string;
  readonly upstream: string;
  readonly downstream: string;
};

export const productCatalog: readonly ProductRecord[] = [
  {
    id: "context-system",
    name: "Context System",
    role: "Shared, task-situated context.",
    responsibility: "Website direction for keeping source-connected knowledge with the work.",
    maturity: "STATE PENDING",
    maturityNote:
      "A site-level direction. It is not a claim that every referenced integration has been released.",
    access: "No independent publication. This page is the public description.",
    docsLabel: "Documentation is this page",
    detailHref: "/products/context-system",
    upstream: "Orgize parses Org source. That parser is a separate project.",
    downstream: "Not an execution runtime, and not a released end-to-end integration.",
  },
  {
    id: "orgize",
    name: "Orgize",
    role: "Parse Org source into elements you can query.",
    responsibility: "Rust Org-mode parser for source-backed elements, queries, and contracts.",
    maturity: "STATE PENDING",
    maturityNote:
      "The open-source mapping describes a public Rust Org parser and does not assign a four-state maturity. Known limit: this site publishes no install steps and no exit criterion. Review date: not published.",
    access: "Public repository. Begin with the README.",
    repository: "https://github.com/tao3k/orgize",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/orgize/blob/main/README.md",
    upstream: "Org-mode source files.",
    downstream:
      "Context System may use it as a parser. That does not make the larger context direction a released product.",
  },
  {
    id: "xiuxian-workshop",
    name: "Xiuxian Artisan Workshop",
    role: "A Rust workspace for agent knowledge and tools.",
    responsibility:
      "Workspace for knowledge, workflows, context, memory, and tool routing. Not one shipped suite.",
    maturity: "STATE PENDING",
    maturityNote:
      "Wendao, Qianji, Qianhuan, and other packages inside the workspace are not separate product pages and are not one released offering.",
    access: "Public repository. Component status stays with the workspace.",
    repository: "https://github.com/tao3k/xiuxian-artisan-workshop",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/xiuxian-artisan-workshop/blob/main/README.md",
    detailHref: "/products/xiuxian-workshop",
    upstream: "The packages it contains keep their own boundaries.",
    downstream:
      "Not a terminal-user agent, and not a claim that every package is released together.",
  },
  {
    id: "agentic-ai-lab",
    name: "Agentic AI Lab",
    role: "Compose strategy before anything runs.",
    responsibility:
      "Scheme control plane for profiles, policies, sessions, workflows, and runtime handoff.",
    maturity: "STATE PENDING",
    maturityNote:
      "It describes and validates strategy. It does not authorize a host or execute an effect. POO Flow is the historical name of this control plane, not a second product.",
    access: "Public repository. Begin with README.org.",
    repository: "https://github.com/tao3k/agentic-ai-lab",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/agentic-ai-lab/blob/main/README.org",
    detailHref: "/products/agentic-ai-lab",
    upstream: "Readable on its own. No separate POO Flow distribution.",
    downstream:
      "A handoff is aimed at a runtime such as Marlin. This site does not claim that path is a finished integration.",
  },
  {
    id: "marlin-agent-core",
    name: "Marlin Agent Core",
    role: "The runtime substrate underneath an agent shell.",
    responsibility: "Rust agent-runtime substrate and typed runtime contracts.",
    maturity: "STATE PENDING",
    maturityNote:
      "The README distinguishes the substrate from a terminal-user product. There is no separate product page beyond this card.",
    access: "Public repository. Not a desktop or phone agent you install from this site.",
    repository: "https://github.com/tao3k/marlin-agent-core",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/marlin-agent-core/blob/main/README.org",
    upstream: "Agentic AI Lab is the strategy control plane, and it is a different repository.",
    downstream:
      "Not a user-facing shell, and not proof that a composed case already runs end to end.",
  },
  {
    id: "meta-relational-reasoning",
    name: "Meta-Relational Reasoning",
    role: "Admit what follows from typed relations.",
    responsibility:
      "Typed relations, facts, rules, provenance, generations, and semantic admission.",
    maturity: "STATE PENDING",
    maturityNote:
      "Ascent computes candidates. MRR owns admission. The old GQL Rust address redirects here; GQL and Cypher are adapters, not a separate product page.",
    access: "Public repository. Begin with the README.",
    repository: "https://github.com/tao3k/meta-relational-reasoning",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/meta-relational-reasoning/blob/main/README.md",
    detailHref: "/products/meta-relational-reasoning",
    upstream: "Ascent is an upstream Rust Datalog engine. tao3k does not maintain that repository.",
    downstream: "MRR Data is the physical data plane. Semantic admission stays here.",
  },
  {
    id: "mrr-data",
    name: "MRR Data",
    role: "Move reasoning data without redefining the fact.",
    responsibility:
      "Physical data plane for Arrow interchange, bounded execution, snapshots, and storage.",
    maturity: "STATE PENDING",
    maturityNote:
      "Storage and execution are separate from semantic admission, which stays with MRR.",
    access: "Public repository. Begin with README.org.",
    repository: "https://github.com/tao3k/mrr-data",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/mrr-data/blob/main/README.org",
    detailHref: "/products/mrr-data",
    upstream: "MRR retains semantic identity, queries, and admission.",
    downstream: "No application handoff is claimed as already qualified.",
  },
  {
    id: "agent-semantic-protocols",
    name: "Agent Semantic Protocols",
    role: "Shared contracts for source-aware code search.",
    responsibility: "Contracts, language harness interfaces, hooks, and replay scenarios.",
    maturity: "STATE PENDING",
    maturityNote:
      "The product-facing asp client is one surface. Provider coverage is not uniform, and search is not a proof of program correctness.",
    access: "Public repository. Begin with the README.",
    repository: "https://github.com/tao3k/agent-semantic-protocols",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/agent-semantic-protocols/blob/main/README.md",
    detailHref: "/products/agent-semantic-protocols",
    upstream: "Language providers own their syntax and evidence.",
    downstream: "A search packet can inform a later plan. It does not authorize a change.",
  },
  {
    id: "lean-poo",
    name: "LeanPoo",
    role: "Reuse a proof only while its assumptions still hold.",
    responsibility: "Lean 4 prototype for composition and dependency-aware proof reuse.",
    maturity: "STATE PENDING",
    maturityNote:
      "Proofs establish their stated model laws. They do not establish arbitrary application or host behavior.",
    access: "Public repository. Begin with README.org.",
    repository: "https://github.com/tao3k/lean-poo",
    docsLabel: "Repository README",
    docsHref: "https://github.com/tao3k/lean-poo/blob/main/README.org",
    detailHref: "/products/lean-poo",
    upstream: "Lean 4.",
    downstream: "Cedar POO Spec uses this composition style. The host still enforces real effects.",
  },
  {
    id: "cedar-poo-spec",
    name: "Cedar POO Spec",
    role: "Compose authorization checks without becoming the enforcer.",
    responsibility: "Reusable authorization models, proofs, and example scenarios.",
    maturity: "STATE PENDING",
    maturityNote:
      "The HardenedLinux repository is the canonical source. The tao3k repository is a mirror. Healthcare, finance, and security examples are models and tests, not a hospital connector, signer, or production gateway.",
    access:
      "Public canonical repository. Scenarios are readable; production enforcement is not included.",
    repository: "https://github.com/hardenedlinux/cedar-poo-spec",
    docsLabel: "Repository README",
    docsHref: "https://github.com/hardenedlinux/cedar-poo-spec/blob/main/README.org",
    detailHref: "/products/cedar-poo-spec",
    upstream: "LeanPoo composition and the Cedar specification.",
    downstream:
      "The consuming host authenticates facts, enforces decisions, and owns real effects.",
  },
  {
    id: "weaver",
    name: "Weaver",
    role: "Carry policy with an agent request.",
    responsibility: "Policy-governed gateway between agents and providers.",
    maturity: "STATE PENDING",
    maturityNote:
      "Weaver is not in the open-source mapping, so no four-state maturity is assigned. The existing product page says the provider path under development is OpenAI-compatible Chat Completions streaming.",
    access: "Public repository. Not a generally available managed gateway.",
    repository: "https://github.com/hardenedlinux/weaver",
    docsLabel: "Repository",
    docsHref: "https://github.com/hardenedlinux/weaver",
    detailHref: "/products/weaver",
    upstream: "Cedar policy and the caller's task identity.",
    downstream: "Provider dispatch stays inside the gateway boundary described by the project.",
  },
  {
    id: "lambda-aitia",
    name: "Lambda Aitia",
    role: "A causal-assurance project for engineering decisions.",
    responsibility: "Research project connecting design, verification, delivery, and feedback.",
    maturity: "STATE PENDING",
    maturityNote:
      "Public documentation must be read before any integration or readiness claim. This site does not make that claim.",
    access: "Public repository. Not presented as an installable release.",
    repository: "https://github.com/tao3k/lambda-aitia",
    docsLabel: "Repository; readiness is not asserted",
    docsHref: "https://github.com/tao3k/lambda-aitia",
    detailHref: "/products/lambda-aitia",
    upstream: "Distinct from proof, model checking, authorization, and runtime execution.",
    downstream: "End-to-end review integration is not asserted.",
  },
  {
    id: "lambda-episteme",
    name: "Lambda Episteme",
    role: "Domain modules a host may select.",
    responsibility: "Domain scenarios, profiles, cases, and sources.",
    maturity: "STATE PENDING",
    maturityNote:
      "Lambda Episteme is not listed in the open-source product mapping. No maturity is assigned. Selecting domain content does not authorize a decision or execute an action.",
    access: "Public repository. Not an adoption promise.",
    repository: "https://github.com/tao3k/lambda-episteme",
    docsLabel: "Repository; integration is not asserted",
    docsHref: "https://github.com/tao3k/lambda-episteme",
    detailHref: "/products/lambda-episteme",
    upstream: "Domain sources supplied by the application.",
    downstream: "MRR or a runtime may be discussed later. That handoff is not claimed as shipped.",
  },
  {
    id: "deterministic-engineering",
    name: "Deterministic Engineering",
    role: "Reusable engineering questions, methods, and evidence.",
    responsibility:
      "HardenedLinux library for project questions, methods, and associated evidence.",
    maturity: "STATE PENDING",
    maturityNote:
      "Deterministic Engineering is not in the open-source mapping, so no four-state maturity is assigned. The existing product page says the project-formation case remains capture-blocked.",
    access: "Public repository. The capture-blocked case is not a runnable demo on this site.",
    repository: "https://github.com/hardenedlinux/deterministic-engineering",
    docsLabel: "Repository",
    docsHref: "https://github.com/hardenedlinux/deterministic-engineering",
    detailHref: "/products/deterministic-engineering",
    upstream: "Scheme and POO definitions in that repository.",
    downstream: "Aitia review integration is a target owned outside this card.",
  },
];

export const productById = (id: string): ProductRecord | undefined =>
  productCatalog.find((product) => product.id === id);

export const productByDetailHref = (href: string): ProductRecord | undefined =>
  productCatalog.find((product) => product.detailHref === href);
