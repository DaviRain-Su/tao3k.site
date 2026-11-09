import type { ComparisonTopicId } from "./comparison-catalog";

type Source = { name: string; url: string };
type Comparison = { name: string; use: string; contrast: string; source: Source };
type Research = {
  scenario: string;
  ours: string;
  boundary: string;
  ownSource: Source;
  comparisons: readonly Comparison[];
  matrix?: { reference: string; rows: readonly (readonly [string, string, string])[] };
};
export const comparisonResearch: Partial<Record<ComparisonTopicId, Research>> = {
  "context-system": {
    scenario:
      "A clinician asks what changed across three visits. The original notes contain both structured measurements and the conversation around them.",
    ours: "Org keeps headings, properties and natural language together. Orgize exposes source-backed elements; MRR Data has a separate healthcare graph-query worker. The intended experience is to select a task-specific context without replacing the original records.",
    boundary:
      "Orgize parsing and the healthcare GQL worker are separate capabilities. Cross-file graph projection and a complete clinician-to-agent workflow are not established by those library tests.",
    ownSource: {
      name: "Orgize source and API",
      url: "https://github.com/tao3k/orgize/blob/16bea3c74af8/README.md",
    },
    matrix: {
      reference: "LlamaIndex",
      rows: [
        [
          "Source",
          "Headings, properties and narrative in Org.",
          "Documents become nodes with metadata.",
        ],
        [
          "Selection",
          "Org elements + a separate GQL worker.",
          "Indexes and retrievers select nodes.",
        ],
        [
          "What to verify",
          "Verify the Org-to-graph projection.",
          "Verify ingestion, context and citations.",
        ],
      ],
    },
    comparisons: [
      {
        name: "LlamaIndex",
        use: "Loads documents, splits them into nodes and supports indexing and retrieval for LLM applications.",
        contrast:
          "Compare how each route preserves source location, metadata and surrounding narrative when answering the same question; LlamaIndex also supports metadata and source relationships.",
        source: {
          name: "Documents and nodes",
          url: "https://developers.llamaindex.ai/python/framework/module_guides/loading/documents_and_nodes/",
        },
      },
      {
        name: "Org + MRR Data",
        use: "Org is a source format; MRR Data executes bounded physical queries over admitted snapshots.",
        contrast:
          "These are components of the proposed approach, not competitors. The healthcare worker uses Scenario → Case → Profile; connecting arbitrary Org notes to that graph is separate work.",
        source: {
          name: "Healthcare query audit",
          url: "https://github.com/tao3k/mrr-data/blob/55285d510bd6/docs/architecture/healthcare-query-audit.org",
        },
      },
    ],
  },
  "agent-semantic-protocols": {
    scenario:
      "An agent must find where a request is authorized, trace related definitions and tests, and return source locations before editing.",
    ours: "ASP defines shared language-provider search contracts and agent-facing query surfaces; language providers own parser facts. Its search architecture connects structured queries and graph-first investigation.",
    boundary:
      "Language coverage, end-to-end graph integration and speed vary by provider and revision; a protocol or roadmap is not a completed cross-language guarantee.",
    ownSource: {
      name: "ASP protocol and search architecture",
      url: "https://github.com/tao3k/agent-semantic-protocols/blob/2ddeeb8741ab/README.md",
    },
    matrix: {
      reference: "Sourcegraph / CodeQL",
      rows: [
        [
          "Search surface",
          "Shared queries; provider-owned parser facts.",
          "Repository navigation / code database queries.",
        ],
        [
          "Investigation",
          "Structured and graph-first investigation.",
          "Definitions, references / data-flow paths.",
        ],
        [
          "Fair test",
          "Name the provider and source revision.",
          "Match the revision, language and locations.",
        ],
      ],
    },
    comparisons: [
      {
        name: "Sourcegraph Code Search",
        use: "Searches across repositories and offers symbols plus definition/reference navigation, including precise indexed navigation.",
        contrast:
          "Compare the same repository revision and question: supported languages, result locations, navigation and agent-facing output. Sourcegraph already has mature navigation; do not assume ASP has broader coverage.",
        source: { name: "Code navigation", url: "https://sourcegraph.com/docs/code-navigation" },
      },
      {
        name: "CodeQL",
        use: "Builds queryable code databases and runs queries, including path queries for information flow.",
        contrast:
          "Compare an authorization-path question using the same language and build. CodeQL is a code-analysis/query ecosystem; ASP's shared provider protocol addresses a different integration boundary.",
        source: {
          name: "CodeQL queries",
          url: "https://codeql.github.com/docs/writing-codeql-queries/about-codeql-queries/",
        },
      },
    ],
  },
  "cedar-poo-spec": {
    scenario:
      "A payment preparer must not also release the payment, and a newly tightened policy must not leave an older broad grant active.",
    ours: "Cedar POO Spec composes typed authorization capabilities with LeanPoo and the Cedar Lean specification; exported cases are checked against the official Cedar authorizer. Its examples cover payment and policy evolution.",
    boundary:
      "A proof or replay applies to its premises and tested case. The host supplies trusted facts, enforces decisions and performs real effects.",
    ownSource: {
      name: "Cedar POO Spec and ownership",
      url: "https://github.com/hardenedlinux/cedar-poo-spec/blob/025964f5fe92/README.org",
    },
    matrix: {
      reference: "Cedar / OPA",
      rows: [
        ["Decision", "Typed capabilities + Cedar replay.", "Cedar decisions / Rego evaluation."],
        [
          "Payment scenario",
          "Separate prepare and release decisions.",
          "Encode equivalent roles and conditions.",
        ],
        [
          "Effect",
          "Host verifies facts and enforces decisions.",
          "Integrate decisions with an enforcement point.",
        ],
      ],
    },
    comparisons: [
      {
        name: "Cedar",
        use: "Evaluates policies for a principal, action, resource and context, producing an allow or deny decision.",
        contrast:
          "Cedar POO Spec builds on Cedar rather than replacing it. Compare how policies are constructed, composed and checked for the same request and entities.",
        source: {
          name: "Cedar authorization",
          url: "https://docs.cedarpolicy.com/auth/authorization.html",
        },
      },
      {
        name: "Open Policy Agent",
        use: "Evaluates declarative Rego policies over structured inputs in application, infrastructure and other settings.",
        contrast:
          "Use the same payment request, data and negative cases. Compare policy authoring, testing, integration and enforcement ownership; no runtime-performance ranking is implied.",
        source: {
          name: "OPA policy language",
          url: "https://www.openpolicyagent.org/docs/policy-language",
        },
      },
      {
        name: "Payment example",
        use: "The project models independent controls for a payment-release decision.",
        contrast:
          "This is the shared scenario to inspect, rather than evidence that every deployed payment system is secured.",
        source: {
          name: "Payment scenario",
          url: "https://github.com/hardenedlinux/cedar-poo-spec/blob/025964f5fe92/Examples/Enterprise/Payment/README.org",
        },
      },
    ],
  },
  "lambda-episteme": {
    scenario:
      "A care team needs to select the applicable domain profile and source for a healthcare case, while keeping authorization separate from knowledge selection.",
    ours: "Lambda Episteme organizes domain meaning through modules, scenarios, profiles, cases and sources. The healthcare query connects a scenario to cases and effective profiles.",
    boundary:
      "A selected case or profile is not an authorization decision or a clinical recommendation; the native application handoff is a separate gate.",
    ownSource: { name: "Lambda Episteme", url: "https://github.com/tao3k/lambda-episteme" },
    matrix: {
      reference: "HL7 FHIR",
      rows: [
        ["Purpose", "Select domain cases and profiles.", "Exchange structured healthcare data."],
        [
          "Building blocks",
          "Scenarios, cases, profiles and sources.",
          "Resources and FHIR profiles.",
        ],
        [
          "Relationship",
          "Map a selected case to its sources.",
          "Map clinical information to resources.",
        ],
      ],
    },
    comparisons: [
      {
        name: "HL7 FHIR",
        use: "A standard for exchanging structured healthcare information electronically.",
        contrast:
          "FHIR resources and profiles define interoperable data; Episteme's domain compositions and case selection address a related but different responsibility. Compare a specific profile and source mapping.",
        source: { name: "FHIR overview", url: "https://www.hl7.org/fhir/overview.html" },
      },
    ],
  },
  "xiuxian-workshop": {
    scenario:
      "An agent needs to retrieve knowledge, carry context across a workflow, and use tools while a person remains able to inspect the work.",
    ours: "Xiuxian Artisan Workshop is a Rust-first workspace developing knowledge, orchestration, context and tooling components. Individual components have separate integration and maturity boundaries.",
    boundary:
      "The workspace's development status is component-specific; its full workflow should not be assumed operational from a repository description.",
    ownSource: {
      name: "Xiuxian Artisan Workshop",
      url: "https://github.com/tao3k/xiuxian-artisan-workshop/blob/74a769d93b6f/README.md",
    },
    matrix: {
      reference: "LangGraph",
      rows: [
        ["Scope", "Knowledge, context and tooling workspace.", "Agent orchestration framework."],
        [
          "Composition",
          "Rust-first components with distinct maturity.",
          "Graph execution and tool coordination.",
        ],
        [
          "Continuation",
          "Check integration for the selected component.",
          "Persistence and interrupts.",
        ],
      ],
    },
    comparisons: [
      {
        name: "LangGraph",
        use: "An agent orchestration framework with graph execution, persistence, interrupts and related capabilities.",
        contrast:
          "Compare the same retrieval-and-tool task, including persistence, tool behavior, recovery and human intervention. A workspace and an orchestration framework overlap but are not identical products.",
        source: {
          name: "LangGraph overview",
          url: "https://docs.langchain.com/oss/python/langgraph/overview",
        },
      },
    ],
  },
  "lambda-aitia": {
    scenario:
      "A service change invalidates an earlier test result. An engineer needs to know which design claims and delivery decisions need renewed evidence.",
    ours: "Lambda Aitia's SDLC direction links requirements, design, implementation, verification, operation and causal assurance; it covers more than a single evidence-invalidation feature.",
    boundary:
      "The linked SDLC framework and its integration include work in progress. A model of evidence validity does not itself execute tests or establish production behavior.",
    ownSource: {
      name: "Aitia SDLC design RFC",
      url: "https://github.com/tao3k/lambda-aitia/blob/f06d41825c14530f3bdb62393387c595ba58c52d/docs/rfcs/0004-sdlc-design-and-causal-trajectories.org",
    },
    matrix: {
      reference: "GitHub Actions",
      rows: [
        ["Focus", "Link claims, changes and evidence.", "Automate repository workflows."],
        ["Change", "Trace affected engineering obligations.", "Run jobs for a repository event."],
        ["Together", "Assess the validity of evidence.", "Produce test and workflow results."],
      ],
    },
    comparisons: [
      {
        name: "GitHub Actions",
        use: "Automates and executes repository workflows, including CI and CD.",
        contrast:
          "Actions can produce test results. Aitia asks how engineering claims, changes and evidence relate across the lifecycle; compare a change and its affected evidence rather than treating workflow execution as equivalent to causal assurance.",
        source: { name: "GitHub Actions documentation", url: "https://docs.github.com/en/actions" },
      },
    ],
  },
  "deterministic-engineering": {
    scenario:
      "A team designs a resource-control service and needs to connect design choices, model obligations and actual measurements.",
    ours: "Deterministic Engineering maintains reusable engineering knowledge, models and method bindings, with project-selected evidence and explicit ownership of native tools.",
    boundary:
      "A reusable design model is not proof that a deployed system meets all properties; individual driver integrations and project acceptance have their own status.",
    ownSource: {
      name: "Deterministic Engineering",
      url: "https://github.com/hardenedlinux/deterministic-engineering/blob/eb52dc6dae3c/README.org",
    },
    matrix: {
      reference: "GitHub Actions",
      rows: [
        ["Focus", "Engineering models and obligations.", "Automated workflow execution."],
        [
          "Evidence",
          "Relate evidence to a design obligation.",
          "Produce results from configured jobs.",
        ],
        [
          "Together",
          "Select methods and acceptance criteria.",
          "Run checks supporting those criteria.",
        ],
      ],
    },
    comparisons: [
      {
        name: "GitHub Actions",
        use: "Executes and automates software workflows in a repository.",
        contrast:
          "Compare how a run's evidence is captured and related to a specific engineering obligation. CI execution can support the engineering library; it is not a substitute for its design model.",
        source: { name: "GitHub Actions documentation", url: "https://docs.github.com/en/actions" },
      },
    ],
  },
  "meta-relational-reasoning": {
    scenario:
      "A source fact changes. A team needs to understand which derived relationship depends on it and whether a result is admissible for the current generation.",
    ours: "MRR owns typed semantic relations, source identity, generations, query/result admission and reasoning boundaries. Physical query and storage execution belong to MRR Data.",
    boundary:
      "MRR is a semantic and admission layer, not a general graph database or agent runtime. A bounded derivation does not authenticate the external facts it receives.",
    ownSource: {
      name: "Meta-Relational Reasoning",
      url: "https://github.com/tao3k/meta-relational-reasoning/blob/d5bc42942b53/README.org",
    },
    matrix: {
      reference: "Soufflé",
      rows: [
        ["Core", "Typed relations and admission boundaries.", "Datalog relations and rules."],
        ["Reasoning", "Source-bound facts and generations.", "Recursive rule evaluation."],
        [
          "Traceability",
          "Inspect source identity and admission.",
          "Use available provenance tools.",
        ],
      ],
    },
    comparisons: [
      {
        name: "Soufflé",
        use: "A Datalog system with relations, rules and provenance tools, often used for static analysis.",
        contrast:
          "Compare the same facts and recursive derivation. MRR also defines admission and generation boundaries; Soufflé has its own provenance facilities and must not be described as lacking them.",
        source: { name: "Soufflé language and provenance", url: "https://souffle-lang.github.io/" },
      },
      {
        name: "OpenLineage",
        use: "A standard for collecting interoperable dataset, job and run lineage metadata.",
        contrast:
          "OpenLineage describes lineage interchange; MRR reasons about admission of source-bound semantic facts. A mapping between them would be an integration, not an automatic property.",
        source: { name: "OpenLineage model", url: "https://openlineage.io/docs/" },
      },
    ],
  },
  "mrr-data": {
    scenario:
      "A healthcare query must move a bounded snapshot to a worker and retrieve the applicable case and profile without changing semantic ownership.",
    ours: "MRR Data provides Arrow interchange, snapshots and bounded physical execution. Its documented healthcare worker accepts the original GQL source and submits candidates to MRR admission.",
    boundary:
      "The healthcare worker and transport have library-level evidence; the Lambda/Marlin application handoff is a separate gate. MRR owns semantic admission.",
    ownSource: {
      name: "Healthcare worker audit",
      url: "https://github.com/tao3k/mrr-data/blob/55285d510bd6/docs/architecture/healthcare-query-audit.org",
    },
    matrix: {
      reference: "Apache DataFusion",
      rows: [
        ["Role", "Snapshot and physical execution layer.", "Arrow-based query engine."],
        [
          "Healthcare",
          "Bounded worker path and candidate results.",
          "Physical query execution in that path.",
        ],
        [
          "Ownership",
          "MRR separately admits semantic results.",
          "Executes queries; not semantic admission.",
        ],
      ],
    },
    comparisons: [
      {
        name: "Apache DataFusion",
        use: "An extensible query engine for Arrow data, offering SQL and DataFrame execution.",
        contrast:
          "DataFusion is used by the documented MRR Data worker, not an independent replacement in that path. Compare physical execution separately from snapshot, catalog and admission responsibilities.",
        source: {
          name: "DataFusion introduction",
          url: "https://datafusion.apache.org/user-guide/introduction.html",
        },
      },
    ],
  },
  "lean-poo": {
    scenario:
      "An application extends an existing policy object. A team wants to reuse a proof only when the properties it depends on remain valid.",
    ours: "LeanPoo is a Lean 4 library for prototype composition, explicit precedence and dependency-aware proof reuse, with examples for live revisions and validation.",
    boundary:
      "Theorems establish their stated assumptions and modeled laws, not arbitrary external behavior or a production authorization system.",
    ownSource: {
      name: "LeanPoo source and examples",
      url: "https://github.com/tao3k/lean-poo/blob/fdf5d860a9d7/README.org",
    },
    matrix: {
      reference: "Lean 4",
      rows: [
        ["Role", "Prototype composition library.", "Programming language and proof assistant."],
        ["Composition", "Explicit prototype precedence.", "General structures and definitions."],
        [
          "Proofs",
          "Dependency-aware proof reuse examples.",
          "Prove properties under stated assumptions.",
        ],
      ],
    },
    comparisons: [
      {
        name: "Lean 4",
        use: "An open-source programming language and proof assistant with a general verification ecosystem.",
        contrast:
          "LeanPoo is built in Lean, not a competing proof assistant. Compare ordinary Lean structures and proof maintenance with a concrete prototype-extension and proof-reuse example.",
        source: { name: "Lean overview", url: "https://lean-lang.org/" },
      },
    ],
  },
};
