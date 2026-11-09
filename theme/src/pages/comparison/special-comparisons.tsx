import nixLogo from "../platform/assets/technology/nixos.svg";
import gerbilLogo from "../platform/assets/technology/gerbil.svg";
import "./special-comparisons.css";

const sources = {
  lab: "https://github.com/tao3k/agentic-ai-lab/blob/4da003496fa5ffb30111ed3dc7fa51ac68f3d030/README.org",
  harness:
    "https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/docs/architecture.md",
  weaver:
    "https://github.com/hardenedlinux/weaver/blob/db9a3eb79ceea18407c6ff28677f0a5a6158a0c5/README.org",
  praxis:
    "https://github.com/praxis-proxy/ai/blob/f96d0114a995765793b1fb33f86f94ecc298eb08/README.md",
  gateway:
    "https://github.com/agentgateway/agentgateway/blob/03042f8f6edad3055628f19ba0fa4922996bc5d5/README.md",
};

type Brand = { name: string; source: string; logo?: string; note?: string };
type Row = { label: string; cells: string[] };
function ComparisonGrid({ brands, rows }: { brands: Brand[]; rows: Row[] }) {
  return (
    <>
      <div className="special-brands-mobile">
        {brands.map((brand) => (
          <a key={brand.name} href={brand.source}>
            {brand.logo && <img src={brand.logo} alt="" />}
            <span>
              {brand.name}
              <small>Source ↗</small>
            </span>
          </a>
        ))}
      </div>
      <div className="special-grid-wrap">
        <table className="special-grid">
          <thead>
            <tr>
              <th scope="col">COMPARE</th>
              {brands.map((brand) => (
                <th scope="col" key={brand.name}>
                  <div className="special-brand">
                    {brand.logo && <img src={brand.logo} alt="" loading="lazy" />}
                    <div>
                      <strong>{brand.name}</strong>
                      {brand.note && <small>{brand.note}</small>}
                      <a href={brand.source}>Source ↗</a>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} style={{ animationDelay: `${index * 80}ms` }}>
                <th scope="row">{row.label}</th>
                {row.cells.map((cell, i) => (
                  <td key={brands[i].name} data-label={brands[i].name}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
const orgAvatar = (name: string) => `https://github.com/${name}.png?size=96`;

export function WeaverComparison() {
  return (
    <section className="product-comparison__matrix special-comparison special-gateway">
      <div className="special-title">
        <div>
          <small>GATEWAY COMPARISON</small>
          <h2>
            One request.
            <br />
            Three approaches.
          </h2>
        </div>
        <p>
          An agent sends an OpenAI-compatible request. Compare routing, controls and streaming on
          that same path.
        </p>
      </div>
      <div
        className="gateway-path"
        aria-label="An agent request travels through a gateway to a model or tool"
      >
        <span>Agent request</span>
        <i aria-hidden="true">→</i>
        <span className="gateway-path__hub">
          Gateway <b>route · control · observe</b>
        </span>
        <i aria-hidden="true">→</i>
        <span>Models &amp; tools</span>
      </div>
      <ComparisonGrid
        brands={[
          {
            name: "Weaver",
            source: sources.weaver,
            logo: orgAvatar("hardenedlinux"),
            note: "HardenedLinux",
          },
          {
            name: "Praxis AI",
            source: sources.praxis,
            logo: orgAvatar("praxis-proxy"),
            note: "Praxis proxy",
          },
          {
            name: "agentgateway",
            source: sources.gateway,
            logo: "https://agentgateway.dev/agw-mark-color.svg",
            note: "Agentic proxy",
          },
        ]}
        rows={[
          {
            label: "Primary focus",
            cells: [
              "Authority, policy and budget boundaries",
              "Provider-aware routing and translation",
              "Connectivity, security and observability",
            ],
          },
          {
            label: "Request path",
            cells: [
              "Policy-governed provider routing",
              "AI filters on the Praxis proxy",
              "Unified gateway for model and tool traffic",
            ],
          },
          {
            label: "Agent traffic",
            cells: [
              "Inspect the supported provider path",
              "MCP and A2A routing examples",
              "LLM, MCP and A2A connectivity",
            ],
          },
          {
            label: "What to test",
            cells: [
              "Authority, budget and stream release",
              "Filters, translations and streaming",
              "Protocols, policy and deployment",
            ],
          },
        ]}
      />
      <p className="special-footnote">
        Compare the same request, configuration and revision. Features and maturity vary; no
        performance ranking is implied.
      </p>
    </section>
  );
}

export function AgentComparison() {
  return (
    <section className="product-comparison__matrix special-comparison special-agent">
      <div className="special-title">
        <div>
          <small>AGENT SYSTEMS</small>
          <h2>
            From intent
            <br />
            to execution.
          </h2>
        </div>
        <p>
          Compose a code-review agent: choose its modules, coordinate work and hand execution to a
          runtime.
        </p>
      </div>
      <div className="agent-composition">
        <div>
          <small>AGENTIC AI LAB</small>
          <div className="composition-chain">
            <span>
              <img src={gerbilLogo} alt="" />
              Scheme modules
            </span>
            <i>→</i>
            <span>Policy &amp; strategy</span>
            <i>→</i>
            <span>Runtime handoff</span>
          </div>
        </div>
        <div>
          <small>DEEPSEEK HARNESS</small>
          <div className="composition-chain">
            <span>Plugins</span>
            <i>→</i>
            <span>Services &amp; profiles</span>
            <i>→</i>
            <span>Agent loop</span>
          </div>
        </div>
      </div>
      <ComparisonGrid
        brands={[
          { name: "Agentic AI Lab", source: sources.lab, logo: gerbilLogo, note: "Gerbil Scheme" },
          {
            name: "DeepSeek Harness",
            source: sources.harness,
            logo: orgAvatar("deepseek-ai"),
            note: "DeepSeek",
          },
        ]}
        rows={[
          {
            label: "Compose",
            cells: [
              "Modules, profiles and policy values",
              "Plugins, services, profiles and bundles",
            ],
          },
          {
            label: "Coordinate",
            cells: [
              "Inspectable strategy and workflow descriptors",
              "Plugin services and runtime sessions",
            ],
          },
          {
            label: "Execute",
            cells: ["Explicit handoff to a runtime", "Agent loop, tools and session event log"],
          },
          {
            label: "Evaluate",
            cells: [
              "Composition and handoff for a specific task",
              "Plugin configuration and runtime behavior",
            ],
          },
        ]}
      />
      <p className="special-footnote">
        Compare a concrete task and runtime integration; composition and execution are distinct
        responsibilities.
      </p>
    </section>
  );
}

const landscape = [
  {
    name: "Agentic AI Lab",
    source: sources.lab,
    layer: "Compose",
    role: "Scheme modules and policy",
    logo: gerbilLogo,
  },
  {
    name: "Nickel",
    source: "https://nickel-lang.org/",
    layer: "Compose",
    role: "Typed configuration and contracts",
  },
  {
    name: "Flox",
    source: "https://flox.dev/nix/",
    layer: "Environment",
    role: "Nix-based development environments",
    logo: orgAvatar("flox"),
  },
  {
    name: "devenv",
    source: "https://devenv.sh/",
    layer: "Environment",
    role: "Developer environments, services and tasks",
  },
  {
    name: "OpenTofu",
    source: "https://opentofu.org/docs/",
    layer: "Provision",
    role: "Provider resources and state",
    logo: orgAvatar("opentofu"),
  },
  {
    name: "Terraform",
    source: "https://developer.hashicorp.com/terraform/intro",
    layer: "Provision",
    role: "HCL resources, providers and state",
    logo: orgAvatar("hashicorp"),
  },
  {
    name: "Pulumi",
    source: "https://www.pulumi.com/docs/iac/",
    layer: "Provision",
    role: "Infrastructure using general-purpose languages",
    logo: orgAvatar("pulumi"),
  },
  {
    name: "Ansible",
    source: "https://docs.ansible.com/projects/ansible/latest/getting_started/introduction.html",
    layer: "Configure",
    role: "Host configuration and automation",
    logo: orgAvatar("ansible"),
  },
  {
    name: "Nix / NixOS",
    source: "https://nixos.org/",
    layer: "System",
    role: "Packages and system generations",
    logo: nixLogo,
  },
  {
    name: "Colmena",
    source: "https://colmena.cli.rs/unstable/",
    layer: "Deploy",
    role: "NixOS fleet deployment",
  },
  {
    name: "Kubernetes",
    source: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    layer: "Workload",
    role: "Container workload rollout",
    logo: orgAvatar("kubernetes"),
  },
  {
    name: "Helm",
    source: "https://helm.sh/docs/intro/using_helm/",
    layer: "Workload",
    role: "Kubernetes application packages",
  },
  {
    name: "Argo CD",
    source: "https://argo-cd.readthedocs.io/en/stable/",
    layer: "Workload",
    role: "GitOps application reconciliation",
  },
];
export function InfrastructureComparison() {
  return (
    <section className="product-comparison__matrix special-comparison special-infra">
      <div className="special-title">
        <div>
          <small>INFRASTRUCTURE LANDSCAPE</small>
          <h2>
            Different layers.
            <br />
            One system.
          </h2>
        </div>
        <p>Compose a multi-service environment, provision resources and deliver workloads.</p>
      </div>
      <div
        className="infra-path"
        aria-label="Infrastructure layers: compose, provision, system, deploy, workload"
      >
        {["Compose", "Provision", "System", "Deploy", "Workload"].map((stage, i) => (
          <div key={stage}>
            <span>0{i + 1}</span>
            <strong>{stage}</strong>
          </div>
        ))}
      </div>
      <div className="infra-landscape">
        <div className="infra-landscape__head">
          <span>TOOL</span>
          <span>PRIMARY LAYER</span>
          <span>ROLE IN THE SCENARIO</span>
        </div>
        {landscape.map((tool) => (
          <a href={tool.source} className="infra-row" key={tool.name}>
            <span className="infra-name">
              {tool.logo && <img src={tool.logo} alt="" />}
              <strong>{tool.name}</strong>
            </span>
            <span>
              <b>{tool.layer}</b>
            </span>
            <span>
              {tool.role} <i>↗</i>
            </span>
          </a>
        ))}
      </div>
      <div className="infra-note">
        <img src={nixLogo} alt="" />
        <div>
          <strong>Keep Nix at the foundation.</strong>
          <p>
            Scheme composition complements Nix modules and Nixpkgs. Hivebus exports Colmena
            configuration; OpenTofu handles provider resources.
          </p>
          <a href="https://github.com/tao3k/agentic-ai-lab/blob/27e1cdc6b8ff/modules/services/opentofu/README.org">
            OpenTofu module ↗
          </a>{" "}
          ·{" "}
          <a href="https://github.com/tao3k/hivebus/blob/edc6095bed63a3c14f9f7147c931378d3e9d1609/units/self/flakeOutputs.nix">
            Hivebus exports ↗
          </a>
        </div>
      </div>
      <p className="special-footnote">
        Layers can overlap and work together. Target deployment and reproducibility need execution
        evidence.
      </p>
    </section>
  );
}
