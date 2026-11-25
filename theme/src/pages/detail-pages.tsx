import { FlowStory } from "../components/flow-story";
import { CodeScene } from "./products/code-scene";
import { codeStory } from "../components/flow-stories";
import { productByDetailHref } from "./products/product-catalog";
import { ProductFacts } from "./products/product-facts";
import "./detail-pages.css";

type Detail = {
  eyebrow: string;
  name: string;
  title: string;
  intro: string;
  challenge: string;
  approach: string;
  steps: readonly [string, string, string];
  source: string;
  sourceLabel?: string;
  related: string;
  relatedLabel: string;
  boundary?: string;
};

export const details = {
  "products/agentic-ai-lab": {
    eyebrow: "PRODUCT / AGENT INFRASTRUCTURE",
    name: "Agentic AI Lab",
    title: "Compose how agents work.",
    intro:
      "A composable control plane for the policies, profiles and workflows that shape an agent system.",
    challenge:
      "Different work calls for different capabilities, scopes and rules. Those choices need to remain understandable as a system evolves.",
    approach:
      "Compose modules and policies as inspectable values, validate their conditions, and hand the resulting strategy to an execution runtime.",
    steps: ["Modules & profiles", "Policy & validation", "Runtime handoff"],
    source: "https://github.com/tao3k/agentic-ai-lab",
    related: "/solutions/composable-agents",
    relatedLabel: "Explore composable agent systems",
    boundary:
      "The control plane describes and validates strategy; execution effects belong to the selected runtime.",
  },
  "products/weaver": {
    eyebrow: "PRODUCT / AI GATEWAY",
    name: "Weaver",
    title: "Keep the rules with the request.",
    intro: "A policy-governed AI agent gateway from the HardenedLinux ecosystem.",
    challenge:
      "Agent traffic crosses models, providers and tools. Routing, retries and streams must retain the original task, current authority and shared budget.",
    approach:
      "Weaver combines configurable routing with Cedar policy and a Rust-owned execution boundary for provider dispatch and stream release.",
    steps: ["Configure & route", "Admit & reserve", "Dispatch & stream"],
    source: "https://github.com/hardenedlinux/weaver",
    related: "/solutions/ai-gateway",
    relatedLabel: "Explore the gateway solution",
    boundary:
      "Under active development: the current provider path supports OpenAI-compatible Chat Completions streaming; broader protocol adapters remain in progress.",
  },
  "products/cedar-poo-spec": {
    eyebrow: "PRODUCT / TRUST",
    name: "Cedar POO Spec",
    title: "Authorization that composes.",
    intro: "An open-source foundation for expressing and checking policy across complex domains.",
    challenge:
      "An action can depend on identity, context, delegation and several overlapping rules. A single broad grant can undermine an otherwise careful policy.",
    approach:
      "Compose Cedar authorization with LeanPoo contracts and proof reuse, then examine concrete domain decisions against the official Cedar authorizer.",
    steps: ["Domain conditions", "Compose policies", "Evaluate decision"],
    source: "https://github.com/hardenedlinux/cedar-poo-spec",
    related: "/solutions/trust-authorization",
    relatedLabel: "Explore trust and authorization",
    boundary:
      "The application supplies trusted facts and enforces real effects. The open scenarios model specific authorization decisions.",
  },
  "products/xiuxian-workshop": {
    eyebrow: "PRODUCT / AGENT WORKSPACE",
    name: "Xiuxian Artisan Workshop",
    title: "Infrastructure for agent work.",
    intro:
      "A Rust-first workspace exploring knowledge, context, workflows, tools and memory for agents.",
    challenge:
      "Agent applications need more than a model call: they need relevant knowledge, usable context, coordinated work and tools.",
    approach:
      "The workspace develops components for retrieval, workflow orchestration, context rendering and tool routing, each with its own project scope.",
    steps: ["Knowledge", "Context & workflow", "Tools & memory"],
    source: "https://github.com/tao3k/xiuxian-artisan-workshop",
    related: "/solutions/composable-agents",
    relatedLabel: "Explore agent solutions",
    boundary: "Consult the workspace for component-specific status and integration boundaries.",
  },
  "products/meta-relational-reasoning": {
    eyebrow: "PRODUCT / REASONING",
    name: "Meta-Relational Reasoning",
    title: "Know what follows, and why.",
    intro:
      "Typed relations, derivations and admission boundaries for reasoning over connected facts.",
    challenge:
      "A query result becomes harder to trust when its assumptions, lineage and admission rules disappear along the way.",
    approach:
      "MRR provides semantic relations, rules and provenance; MRR Data supports the physical data plane for snapshots and interchange.",
    steps: ["Facts & relations", "Rules & lineage", "Admission"],
    source: "https://github.com/tao3k/meta-relational-reasoning",
    related: "/products/mrr-data",
    relatedLabel: "Explore MRR Data",
  },
  "products/agent-semantic-protocols": {
    eyebrow: "PRODUCT / CODE INTELLIGENCE",
    name: "Agent Semantic Protocols",
    title: "Find the code behind the question.",
    intro:
      "Source-aware search and shared contracts for agents working across programming languages.",
    challenge:
      "A text match alone rarely explains which definition owns a behavior, which tests cover it or which dependencies matter.",
    approach:
      "ASP routes search and syntax queries through language providers, returning structured, source-backed packets that agents can use to plan focused investigation.",
    steps: ["Ask a code question", "Search provider facts", "Inspect source & tests"],
    source: "https://github.com/tao3k/agent-semantic-protocols",
    related: "/solutions/code-intelligence",
    relatedLabel: "Explore code intelligence",
    boundary:
      "Provider support and end-to-end integrations vary; semantic search is not itself a proof of program correctness.",
  },
  "products/mrr-data": {
    eyebrow: "PRODUCT / DATA PLANE",
    name: "MRR Data",
    title: "Carry reasoning into data.",
    intro: "The physical data plane for bounded execution, interchange, snapshots and storage.",
    challenge:
      "Reasoning needs usable data and repeatable snapshots without confusing physical storage with the meaning of a fact.",
    approach:
      "MRR Data supplies Arrow interchange, bounded physical execution and storage providers; MRR retains semantic identity, queries and admission.",
    steps: ["Source data", "Snapshots & execution", "Semantic admission"],
    source: "https://github.com/tao3k/mrr-data",
    related: "/products/meta-relational-reasoning",
    relatedLabel: "Explore MRR",
    boundary: "Physical worker results and application-level handoff are separately qualified.",
  },
  "products/lean-poo": {
    eyebrow: "PRODUCT / FORMAL FOUNDATIONS",
    name: "LeanPoo",
    title: "Compose evidence with the system.",
    intro: "A Lean library for prototype-oriented composition and dependency-aware proof reuse.",
    challenge:
      "When components change, a proof should be reused only while its declared assumptions and dependencies still hold.",
    approach:
      "LeanPoo composes typed operations and obligations, retaining evidence whose dependencies remain valid across revisions.",
    steps: ["Compose definitions", "State obligations", "Reuse valid evidence"],
    source: "https://github.com/tao3k/lean-poo",
    related: "/solutions/engineering-assurance",
    relatedLabel: "Explore engineering assurance",
    boundary:
      "Proofs establish their stated model laws; application effects and external implementation refinement remain separate.",
  },
  "products/lambda-aitia": {
    eyebrow: "PRODUCT / HUMAN + AI ENGINEERING",
    name: "Lambda Aitia",
    title: "Better software begins with better decisions.",
    intro: "A Human + AI framework for the software lifecycle and its engineering decisions.",
    challenge:
      "Teams need to connect requirements, alternatives, implementation, verification and operational feedback across changing software.",
    approach:
      "Aitia organizes lifecycle decisions and connects design alternatives, evidence and feedback through causal assurance.",
    steps: ["Explore the design", "Build & verify", "Learn & evolve"],
    source: "https://github.com/tao3k/lambda-aitia",
    related: "/solutions/engineering-assurance",
    relatedLabel: "Explore engineering assurance",
    boundary:
      "Formal proof, model checking, authorization and runtime execution retain distinct owners and evidence boundaries.",
  },
  "products/lambda-episteme": {
    eyebrow: "PRODUCT / DOMAIN KNOWLEDGE",
    name: "Lambda Episteme",
    title: "Give systems the language of the work.",
    intro: "Composable domain knowledge for healthcare, finance and other vertical settings.",
    challenge:
      "Rules and decisions lose meaning when the domain concepts, sources and situations behind them are disconnected.",
    approach:
      "Episteme organizes domain knowledge into modules, scenarios, reusable profiles, cases and explicit sources for an application to select.",
    steps: ["Domain sources", "Profiles & cases", "Selected composition"],
    source: "https://github.com/tao3k/lambda-episteme",
    related: "/solutions/domain-knowledge",
    relatedLabel: "Explore domain solutions",
    boundary:
      "Selecting domain content does not by itself authorize a decision or execute an action.",
  },
  "products/deterministic-engineering": {
    eyebrow: "PRODUCT / ENGINEERING",
    name: "Deterministic Engineering",
    title: "Make engineering decisions traceable.",
    intro: "A HardenedLinux library for reusable engineering questions, methods and evidence.",
    challenge:
      "Architecture choices and verification results are difficult to maintain when their inputs, assumptions and revision identities drift apart.",
    approach:
      "Scheme and POO compose library definitions, profiles and project scenarios; relational questions and selected methods retain their own source and result boundaries.",
    steps: ["Questions & models", "Select methods", "Associate evidence"],
    source: "https://github.com/hardenedlinux/deterministic-engineering",
    related: "/solutions/engineering-assurance",
    relatedLabel: "Explore engineering assurance",
    boundary:
      "The documented project-formation case remains capture-blocked; end-to-end Aitia review integration is a target.",
  },
  "solutions/code-intelligence": {
    eyebrow: "SOLUTION / CODE INTELLIGENCE",
    name: "Agentic code intelligence",
    title: "From a question to the code that matters.",
    intro:
      "Help people and agents investigate code through source-aware search and structured context.",
    challenge:
      "Large codebases scatter behavior across definitions, dependencies and tests. Agents need a focused path into the evidence before proposing a change.",
    approach:
      "ASP's language providers and search contracts supply a source-backed starting point. Combining search, Scheme composition, reasoning and verification is a broader direction in development.",
    steps: ["Find symbols & owners", "Follow dependencies", "Inspect source & tests"],
    source: "https://github.com/tao3k/agent-semantic-protocols",
    related: "/products/agent-semantic-protocols",
    relatedLabel: "Explore ASP",
    boundary:
      "The illustrated combination is a direction, not a claim of completed end-to-end integration or automatic proof.",
  },
  "solutions/engineering-assurance": {
    eyebrow: "SOLUTION / ENGINEERING ASSURANCE",
    name: "Deterministic engineering",
    title: "Keep the evidence connected to change.",
    intro: "Bring people, AI and engineering knowledge together across the software lifecycle.",
    challenge:
      "Engineering choices span requirements, design, implementation and operation. Teams need to compare alternatives and understand how new evidence affects their decisions.",
    approach:
      "Lambda Aitia's Human + AI SDLC direction connects design alternatives, implementation, verification and feedback. Deterministic Engineering contributes reusable engineering models and methods.",
    steps: ["Explore the design", "Build & verify", "Learn & evolve"],
    source: "https://github.com/hardenedlinux/deterministic-engineering",
    related: "/products/lambda-aitia",
    relatedLabel: "Explore Lambda Aitia",
    boundary:
      "The documented integration remains in progress; a passing check does not prove an entire deployment.",
  },
  "solutions/domain-knowledge": {
    eyebrow: "SOLUTION / DOMAIN INTELLIGENCE",
    name: "Domain knowledge and reasoning",
    title: "Bring domain meaning into decisions.",
    intro: "Connect domain concepts, source evidence and explicit rules for complex industry work.",
    challenge:
      "Healthcare, finance and other domains carry different concepts and responsibilities. Generic answers can miss the conditions that make a decision meaningful.",
    approach:
      "Lambda Episteme contributes domain scenarios and profiles; MRR offers typed relations, bounded rules and lineage. Their integration and runtime handoff must be qualified for each application.",
    steps: ["Domain context", "Rules & evidence", "Review decision"],
    source: "https://github.com/tao3k/lambda-episteme",
    related: "/products/meta-relational-reasoning",
    relatedLabel: "Explore MRR",
    boundary:
      "Domain selection and reasoning do not themselves grant authorization or perform a real-world effect.",
  },
  "solutions/composable-agents": {
    eyebrow: "SOLUTION / AGENT SYSTEMS",
    name: "Composable agent systems",
    title: "Build the strategy around the work.",
    intro:
      "Bring agent modules, policy and runtime responsibilities into one understandable composition.",
    challenge:
      "A growing agent system accumulates profiles, tools and workflows. Without explicit boundaries, changing one part can obscure what the agent may do.",
    approach:
      "Agentic AI Lab expresses modules, profiles and policies as inspectable strategy values, validates conditions and prepares a handoff to the execution runtime.",
    steps: ["Compose modules", "Validate policy", "Hand off"],
    source: "https://github.com/tao3k/agentic-ai-lab",
    related: "/products/agentic-ai-lab",
    relatedLabel: "Meet Agentic AI Lab",
    boundary:
      "The strategy control plane and the runtime that performs effects have distinct responsibilities.",
  },
  "solutions/ai-gateway": {
    eyebrow: "SOLUTION / AGENT CONNECTIVITY",
    name: "Governed AI gateway",
    title: "Connect agents without losing control.",
    intro:
      "Keep policy, task identity and budget connected as requests move between agents and providers.",
    challenge:
      "A retry or stream crosses multiple boundaries. A valid route alone does not establish that a particular action is still authorized.",
    approach:
      "Weaver brings routing proposals, current Cedar policy, authority consumption and provider dispatch into a governed gateway architecture.",
    steps: ["Route request", "Check authority", "Release stream"],
    source: "https://github.com/hardenedlinux/weaver",
    related: "/products/weaver",
    relatedLabel: "Meet Weaver",
    boundary:
      "Weaver is under active development; broader protocol adapters and Kubernetes reconciliation remain delivery work.",
  },
  "solutions/trust-authorization": {
    eyebrow: "SOLUTION / TRUST",
    name: "Trust & authorization",
    title: "The right action, in context.",
    intro:
      "Design authorization for work where identity, delegation and current conditions matter.",
    challenge:
      "A model can suggest an action, but permission can depend on a combination of people, data, policy and purpose.",
    approach:
      "Cedar POO Spec provides reusable authorization and proof foundations; domain scenarios make policy decisions concrete.",
    steps: ["Domain context", "Compose controls", "Authorize action"],
    source: "https://github.com/hardenedlinux/cedar-poo-spec",
    related: "/products/cedar-poo-spec",
    relatedLabel: "Meet Cedar POO Spec",
    boundary: "Real applications authenticate facts and enforce decisions at the effect boundary.",
  },
  "solutions/healthcare": {
    eyebrow: "SOLUTION / HEALTHCARE",
    name: "Healthcare",
    title: "The right patient. The right disclosure.",
    intro:
      "Support authorization decisions where patient identity, privacy and payer requirements meet.",
    challenge:
      "A clinical record may belong to the wrong patient; a draft may expose raw records; a delegation or payer requirement may no longer be current.",
    approach:
      "The synthetic prior-authorization example composes patient identity, disclosure, payer rules and delegation at read and submission boundaries.",
    steps: ["Patient & records", "Identity & privacy", "Submission check"],
    source:
      "https://github.com/hardenedlinux/cedar-poo-spec/blob/main/Examples/Health/PriorAuthorization/README.org",
    sourceLabel: "Read the open scenario",
    related: "/products/cedar-poo-spec",
    relatedLabel: "Explore the foundation",
    boundary:
      "This is a modeled example. Patient verification, clinical accuracy and EHR integration remain with the application.",
  },
  "solutions/financial-services": {
    eyebrow: "SOLUTION / FINANCIAL SERVICES",
    name: "Financial services",
    title: "A payment needs more than one permission.",
    intro: "Make independent responsibilities explicit in consequential payment decisions.",
    challenge:
      "A payment release might come from the preparer, exceed a threshold or remain allowed by an older broad grant.",
    approach:
      "The open payment example composes separation of duties, thresholds and risk checks, with two decisions against the same payment snapshot.",
    steps: ["Prepare payment", "Independent controls", "Release decision"],
    source:
      "https://github.com/hardenedlinux/cedar-poo-spec/blob/main/Examples/Enterprise/Payment/README.org",
    sourceLabel: "Read the open scenario",
    related: "/products/cedar-poo-spec",
    relatedLabel: "Explore the foundation",
    boundary:
      "The consuming application authenticates actors and facts, enforces the decisions and performs the transfer.",
  },
  "solutions/linux-hardening": {
    eyebrow: "SOLUTION / SYSTEM SECURITY",
    name: "Linux hardening",
    title: "Harden the system beneath the workload.",
    intro: "Build a stronger Linux foundation with the HardenedLinux ecosystem.",
    challenge:
      "Sensitive workloads need defenses that extend beyond application permissions to operating-system configuration and isolation.",
    approach:
      "Use declarative system hardening and security controls as building blocks, selected and validated for each environment.",
    steps: ["System configuration", "Kernel & access controls", "Workload isolation"],
    source: "https://github.com/hardenedlinux/lego-hardening",
    sourceLabel: "Explore LEGO Hardening",
    related: "/solutions/security-identity",
    relatedLabel: "Explore security in layers",
    boundary:
      "Hardening depends on the kernel, configuration and deployment. The open repository provides system-hardening building blocks; effectiveness requires workload-specific validation.",
  },
  "solutions/security-identity": {
    eyebrow: "SOLUTION / SECURITY",
    name: "Security & identity",
    title: "A tighter rule can leave an older door open.",
    intro: "Understand how policies interact as systems and access requirements evolve.",
    challenge:
      "A tenant restriction and trusted-device check may look correct while a separate broad grant still permits access.",
    approach:
      "The open policy-evolution example composes tenant and device controls, then explicitly removes the old broad grant.",
    steps: ["Tenant request", "Device & policies", "Allow or deny"],
    source:
      "https://github.com/hardenedlinux/cedar-poo-spec/blob/main/Examples/Scenarios/README.org",
    sourceLabel: "Read the open scenario",
    related: "/products/cedar-poo-spec",
    relatedLabel: "Explore the foundation",
    boundary: "The host supplies trusted current facts and enforces the modeled decision.",
  },
} as const satisfies Record<string, Detail>;

export type DetailRouteId = keyof typeof details;
export const detailRouteIds = Object.keys(details) as DetailRouteId[];

function CodeSearchIllustration() {
  return (
    <div className="search-illustration" aria-label="Illustrative code investigation">
      <div className="search-illustration__top">
        <span>CODE INVESTIGATION</span>
        <span>ILLUSTRATIVE</span>
      </div>
      <div className="search-illustration__query">
        <span aria-hidden="true">⌕</span> Where is this action authorized?
      </div>
      <div className="search-illustration__results">
        <div>
          <small>01 / DEFINITION</small>
          <strong>Find the owner</strong>
          <span>Source location and symbol</span>
        </div>
        <div>
          <small>02 / RELATIONSHIP</small>
          <strong>Follow dependencies</strong>
          <span>Calls, imports and scope</span>
        </div>
        <div>
          <small>03 / EVIDENCE</small>
          <strong>Inspect the tests</strong>
          <span>Relevant source and checks</span>
        </div>
      </div>
      <p>Source-aware search gives people and agents a place to begin.</p>
    </div>
  );
}

export function DetailPage({ id }: { readonly id: DetailRouteId }) {
  const page: Detail = details[id];
  const product = id.startsWith("products/") ? productByDetailHref(`/${id}`) : undefined;
  return (
    <article className="detail-page">
      <section className="detail-hero">
        <div>
          <p className="detail-kicker">{page.eyebrow}</p>
          <p className="detail-name">{page.name}</p>
          <h1>{page.title}</h1>
          <p className="detail-intro">{page.intro}</p>
          <a className="detail-link" href={page.source}>
            {page.sourceLabel ?? "Explore the open source"} <span aria-hidden="true">↗</span>
          </a>
        </div>
        {id === "products/agent-semantic-protocols" || id === "solutions/code-intelligence" ? (
          <CodeSearchIllustration />
        ) : (
          <div className="detail-flow" aria-label="Illustrative sequence">
            <p>AN ILLUSTRATIVE VIEW</p>
            {page.steps.map((step, index) => (
              <div className="detail-flow__row" key={step}>
                <small>0{index + 1}</small>
                <strong>{step}</strong>
                <span aria-hidden="true">{index < 2 ? "↓" : "◇"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      {id === "solutions/code-intelligence" && (
        <FlowStory
          story={codeStory}
          renderScene={(phase, moving) => <CodeScene phase={phase} moving={moving} />}
        />
      )}
      {product ? (
        <section className="detail-facts" aria-label={`${product.name} status`}>
          <ProductFacts product={product} />
        </section>
      ) : null}
      <section className="detail-story">
        <p className="detail-kicker">THE CHALLENGE</p>
        <h2>{page.challenge}</h2>
      </section>
      <section className="detail-approach">
        <div>
          <p className="detail-kicker">THE APPROACH</p>
          <h2>Designed around the work.</h2>
        </div>
        <div>
          <p>{page.approach}</p>
          {page.boundary && <p>{page.boundary}</p>}
          <a className="detail-link" href={page.related}>
            {page.relatedLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <section className="detail-next">
        <p className="detail-kicker">KEEP EXPLORING</p>
        <a className="detail-link" href={id.startsWith("products/") ? "/products" : "/solutions"}>
          View all {id.startsWith("products/") ? "products" : "solutions"}{" "}
          <span aria-hidden="true">→</span>
        </a>
      </section>
    </article>
  );
}
