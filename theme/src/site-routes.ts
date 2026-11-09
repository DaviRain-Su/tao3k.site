export const comparisonRouteIds = [
  "comparison/infrastructure",
  "comparison/context-system",
  "comparison/lambda-episteme",
  "comparison/agentic-ai-lab",
  "comparison/xiuxian-workshop",
  "comparison/weaver",
  "comparison/agent-semantic-protocols",
  "comparison/lambda-aitia",
  "comparison/deterministic-engineering",
  "comparison/meta-relational-reasoning",
  "comparison/mrr-data",
  "comparison/cedar-poo-spec",
  "comparison/lean-poo",
] as const;

export const primarySiteRouteIds = [
  "platform",
  "products",
  "solutions",
  "comparison",
  "principles",
  "roadmap",
] as const;

export const platformDeploymentRouteIds = [
  "platform/on-premises",
  "platform/hybrid",
  "platform/managed-cloud",
] as const;

export const detailSiteRouteIds = [
  "products/agentic-ai-lab",
  "products/weaver",
  "products/cedar-poo-spec",
  "products/xiuxian-workshop",
  "products/meta-relational-reasoning",
  "products/agent-semantic-protocols",
  "products/mrr-data",
  "products/lean-poo",
  "products/lambda-aitia",
  "products/lambda-episteme",
  "products/deterministic-engineering",
  "solutions/code-intelligence",
  "solutions/engineering-assurance",
  "solutions/domain-knowledge",
  "solutions/composable-agents",
  "solutions/ai-gateway",
  "solutions/trust-authorization",
  "solutions/healthcare",
  "solutions/financial-services",
  "solutions/security-identity",
  "solutions/linux-hardening",
  "solutions/privacy",
] as const;

export const siteRouteIds = [
  ...primarySiteRouteIds,
  ...platformDeploymentRouteIds,
  "products/context-system",
  ...detailSiteRouteIds,
  ...comparisonRouteIds,
] as const;

export type SiteRouteId = (typeof siteRouteIds)[number];

export type SiteRouteDefinition = Readonly<{
  id: SiteRouteId;
  path: `/${SiteRouteId}`;
  label: string;
  kicker: string;
  title: string;
  summary: string;
}>;

export const siteRoutes: readonly SiteRouteDefinition[] = [
  {
    id: "platform",
    path: "/platform",
    label: "Platform",
    kicker: "One governed lifecycle",
    title: "An evidence–action system, not another isolated AI tool.",
    summary:
      "tao3k connects discovery, scientific qualification, human authority, executable composition, agent runtime and learning evidence without erasing the meaning carried between them.",
  },
  {
    id: "products",
    path: "/products",
    label: "Products",
    kicker: "Open-source ecosystem",
    title: "Independent engines with explicit ownership and one evidence contract.",
    summary:
      "Each project owns a clear systems boundary. Together they form a lifecycle that can be inspected, replaced and extended without collapsing into one opaque platform.",
  },
  {
    id: "products/context-system",
    path: "/products/context-system",
    label: "Context System",
    kicker: "Org-mode / shared knowledge",
    title: "Context that stays connected to its sources.",
    summary:
      "An Org-centered system for situated, source-qualified knowledge across tasks and sessions.",
  },
  {
    id: "solutions",
    path: "/solutions",
    label: "Solutions",
    kicker: "Research ↔ operations",
    title: "Carry scientific meaning into operation—and operational evidence back.",
    summary:
      "The handoff from research to industry must retain assumptions, proofs, policy, authority and outcomes. Shipping faster is not enough when the handoff destroys trust.",
  },
  {
    id: "comparison",
    path: "/comparison",
    label: "Comparison",
    kicker: "Compare system boundaries",
    title: "The important question is what survives the handoff.",
    summary:
      "Feature lists hide architectural boundaries. tao3k is evaluated by whether knowledge, proof, authority, execution and learning evidence remain connected across the complete lifecycle.",
  },
  {
    id: "principles",
    path: "/principles",
    label: "Principles",
    kicker: "Human agency",
    title: "AI should expand human capability, participation and responsibility.",
    summary:
      "tao3k rejects replacement as the only measure of progress. High-risk authority stays explicit, conclusions stay inspectable and technical progress should increase—not narrow—who can participate.",
  },
  {
    id: "roadmap",
    path: "/roadmap",
    label: "Roadmap",
    kicker: "A long-lived systems program",
    title: "Build the evidence economy in dependency-ordered layers.",
    summary:
      "The roadmap is organized by capabilities that must become trustworthy before the next layer can depend on them—not by promotional version numbers or artificial deadlines.",
  },
  {
    id: "platform/on-premises",
    path: "/platform/on-premises",
    label: "On-Premises",
    kicker: "Customer-owned authority boundary",
    title: "Run the qualified system inside infrastructure you control.",
    summary:
      "Data, identity, secrets, hardware policy and operational authority remain inside the customer boundary while tao3k delivers a reproducible system closure and evidence-bearing updates.",
  },
  {
    id: "platform/hybrid",
    path: "/platform/hybrid",
    label: "Hybrid",
    kicker: "Local authority, elastic capability",
    title: "Keep consequential authority local while qualified workloads move.",
    summary:
      "Hybrid deployment separates the authority and sensitive-data plane from qualified compute and coordination surfaces without turning the boundary into an undocumented integration.",
  },
  {
    id: "platform/managed-cloud",
    path: "/platform/managed-cloud",
    label: "Managed Cloud",
    kicker: "Managed operation with explicit evidence",
    title: "Use a managed system without surrendering artifact or decision identity.",
    summary:
      "tao3k manages service operation while tenant, region, model, artifact, policy and receipt identity remain visible and independently qualifiable.",
  },
  ...comparisonRouteIds.map((id) => ({
    id,
    path: `/${id}` as const,
    label: id.slice(11).replaceAll("-", " "),
    kicker: "Product comparison",
    title: "Product comparison",
    summary: "Explore the product comparison.",
  })),
  ...detailSiteRouteIds.map((id) => ({
    id,
    path: `/${id}` as `/${typeof id}`,
    label: id
      .split("/")
      .at(-1)!
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" "),
    kicker: id.startsWith("products/") ? "Open-source product" : "Solution",
    title: "Explore the system.",
    summary: "Explore the project's purpose, approach and open-source foundations.",
  })),
];

const primarySiteRouteIdSet = new Set<SiteRouteId>(primarySiteRouteIds);

export const siteNavigation = siteRoutes
  .filter(({ id }) => primarySiteRouteIdSet.has(id))
  .map(({ label, path }) => ({
    label,
    href: path,
  }));

const platformDeploymentRouteIdSet = new Set<SiteRouteId>(platformDeploymentRouteIds);

export const platformNavigation = [
  { label: "Platform overview", href: "/platform", detail: "System architecture" },
  ...siteRoutes
    .filter(({ id }) => platformDeploymentRouteIdSet.has(id))
    .map(({ label, path, kicker }) => ({ label, href: path, detail: kicker })),
] as const;

export const resolveSiteRoute = (documentId: string): SiteRouteDefinition | null => {
  const normalized = documentId.replace(/^\/+|\/+$/g, "").toLowerCase();
  return siteRoutes.find(({ id }) => id === normalized) ?? null;
};
