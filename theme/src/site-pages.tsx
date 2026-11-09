import type { ReactNode } from "react";
import { Tao3kSiteFooter } from "./site-footer";
import { PlatformDeploymentPage } from "./pages/platform/deployment-mode-page";
import { PlatformPage } from "./pages/platform/platform-page";
import { ContextSystemPage } from "./pages/products/context-system-page";
import { ProductsPage } from "./pages/products/products-page";
import { AitiaPage } from "./pages/products/aitia-page";
import { DetailPage } from "./pages/detail-pages";
import { SolutionsPage } from "./pages/solutions/solutions-page";
import { PrivacyPage } from "./pages/solutions/privacy-page";
import { SecurityPage } from "./pages/solutions/security-page";
import { ComparisonPage } from "./pages/comparison/comparison-page";
import { ProductComparisonPage } from "./pages/comparison/product-comparison-page";
import { comparisonTopics, type ComparisonRouteId } from "./pages/comparison/comparison-catalog";
import { PrinciplesPage } from "./pages/principles/principles-page";
import { RoadmapPage } from "./pages/roadmap/roadmap-page";
import type { SiteRouteDefinition, SiteRouteId } from "./site-routes";
import "./site-pages.css";

export type ApplicationPageData = Readonly<{
  shell: unknown;
  route: SiteRouteDefinition | null;
  requestedId: string;
}>;

const comparisonPages = Object.fromEntries(
  comparisonTopics.map(({ id }) => [`comparison/${id}`, () => <ProductComparisonPage id={id} />]),
) as Record<ComparisonRouteId, () => ReactNode>;

const routePages: Readonly<Record<SiteRouteId, () => ReactNode>> = {
  ...comparisonPages,
  platform: PlatformPage,
  "platform/on-premises": () => <PlatformDeploymentPage modeId="platform/on-premises" />,
  "platform/hybrid": () => <PlatformDeploymentPage modeId="platform/hybrid" />,
  "platform/managed-cloud": () => <PlatformDeploymentPage modeId="platform/managed-cloud" />,
  products: ProductsPage,
  "products/context-system": ContextSystemPage,
  "products/agentic-ai-lab": () => <DetailPage id="products/agentic-ai-lab" />,
  "products/weaver": () => <DetailPage id="products/weaver" />,
  "products/cedar-poo-spec": () => <DetailPage id="products/cedar-poo-spec" />,
  "products/xiuxian-workshop": () => <DetailPage id="products/xiuxian-workshop" />,
  "products/meta-relational-reasoning": () => (
    <DetailPage id="products/meta-relational-reasoning" />
  ),
  "products/agent-semantic-protocols": () => <DetailPage id="products/agent-semantic-protocols" />,
  "products/mrr-data": () => <DetailPage id="products/mrr-data" />,
  "products/lean-poo": () => <DetailPage id="products/lean-poo" />,
  "products/lambda-aitia": AitiaPage,
  "products/lambda-episteme": () => <DetailPage id="products/lambda-episteme" />,
  "products/deterministic-engineering": () => (
    <DetailPage id="products/deterministic-engineering" />
  ),
  "solutions/code-intelligence": () => <DetailPage id="solutions/code-intelligence" />,
  "solutions/engineering-assurance": () => <DetailPage id="solutions/engineering-assurance" />,
  "solutions/domain-knowledge": () => <DetailPage id="solutions/domain-knowledge" />,
  "solutions/composable-agents": () => <DetailPage id="solutions/composable-agents" />,
  "solutions/ai-gateway": () => <DetailPage id="solutions/ai-gateway" />,
  "solutions/trust-authorization": () => <DetailPage id="solutions/trust-authorization" />,
  "solutions/healthcare": () => <DetailPage id="solutions/healthcare" />,
  "solutions/financial-services": () => <DetailPage id="solutions/financial-services" />,
  "solutions/security-identity": SecurityPage,
  "solutions/linux-hardening": () => <DetailPage id="solutions/linux-hardening" />,
  "solutions/privacy": PrivacyPage,
  solutions: SolutionsPage,
  comparison: ComparisonPage,
  principles: PrinciplesPage,
  roadmap: RoadmapPage,
};

function SiteDocument({ route, requestedId }: ApplicationPageData) {
  if (!route) {
    return (
      <main className="tao3k-not-found">
        <p className="tao3k-route-kicker">UNKNOWN DESTINATION</p>
        <h1>“{requestedId || "this route"}” is not part of the public site.</h1>
        <a href="/">
          Return home <span aria-hidden="true">→</span>
        </a>
      </main>
    );
  }
  const Page = routePages[route.id];
  return (
    <main className={`tao3k-route-page tao3k-route-page--${route.id}`}>
      <Page />
    </main>
  );
}

export function Tao3kApplicationHome({ shell: _shell }: { readonly shell: unknown }) {
  return <Tao3kSiteFooter />;
}

export function Tao3kApplicationDocument(data: ApplicationPageData) {
  return (
    <div className="tao3k-application-shell">
      <SiteDocument {...data} />
      <Tao3kSiteFooter />
    </div>
  );
}
