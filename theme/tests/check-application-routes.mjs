import assert from "node:assert/strict";
import { comparisonTopics } from "../src/pages/comparison/comparison-catalog.ts";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import {
  comparisonRouteIds,
  platformDeploymentRouteIds,
  detailSiteRouteIds,
  platformNavigation,
  primarySiteRouteIds,
  resolveSiteRoute,
  siteNavigation,
  siteRouteIds,
  siteRoutes,
} from "../src/site-routes.ts";

assert.equal(primarySiteRouteIds.length, 6);
assert.equal(platformDeploymentRouteIds.length, 3);
assert.equal(siteRouteIds.length, 10 + detailSiteRouteIds.length + comparisonTopics.length);
assert.deepEqual(
  comparisonRouteIds,
  comparisonTopics.map(({ id }) => `comparison/${id}`),
);
assert.equal(new Set(siteRouteIds).size, siteRouteIds.length);
assert.equal(new Set(siteRoutes.map(({ path }) => path)).size, siteRoutes.length);
assert.deepEqual(
  siteNavigation.map(({ href }) => href),
  primarySiteRouteIds.map((id) => `/${id}`),
);
assert.deepEqual(
  platformNavigation.map(({ href }) => href),
  ["/platform", ...platformDeploymentRouteIds.map((id) => `/${id}`)],
);

for (const route of siteRoutes) {
  assert.equal(resolveSiteRoute(route.path), route);
  assert.equal(resolveSiteRoute(`${route.id}/`), route);
}

assert.equal(resolveSiteRoute("unknown"), null);
assert.equal(
  siteNavigation.some(({ href }) => href.startsWith("#")),
  false,
);

const output = await mkdtemp(resolve(tmpdir(), "tao3k-pages-shell-"));
await writeFile(resolve(output, "index.html"), "<html><head></head><body></body></html>");
execFileSync(process.execPath, [
  "--experimental-strip-types",
  "theme/src/build/prepare-application-pages.mjs",
  output,
]);
for (const path of ["index.html", "404.html", ...siteRouteIds.map((id) => `${id}/index.html`)]) {
  assert.match(await readFile(resolve(output, path), "utf8"), /data-tao3k-startup="night"/);
}

console.log(
  `tao3k-application-routes status=ok routes=${siteRoutes.length} navigation=${siteNavigation.length}`,
);
