import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import vm from "node:vm";
import { prepareLocalHost } from "../src/build/prepare-local-host.mjs";
import {
  siteHrefForBase,
  startupStyleSource,
  themeBootstrapSource,
  withStartupCanvas,
} from "../src/build/prepare-host-shell.mjs";
import { hostThemeVariantKey, legacyThemeVariantKey } from "../src/theme-variant.mjs";

const bootTheme = ({ host, legacy, light }) => {
  const store = new Map();
  if (host !== undefined) store.set(hostThemeVariantKey, host);
  if (legacy !== undefined) store.set(legacyThemeVariantKey, legacy);
  const root = { dataset: {}, style: {} };
  vm.runInNewContext(themeBootstrapSource, {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => {
        store.set(key, value);
      },
    },
    window: { matchMedia: () => ({ matches: light }) },
    document: { documentElement: root },
  });
  return { root, store };
};

const firstLightVisit = bootTheme({ light: true });
assert.equal(firstLightVisit.root.dataset.themeVariant, "paper");
assert.equal(firstLightVisit.store.get(hostThemeVariantKey), "paper");

const firstDarkVisit = bootTheme({ light: false });
assert.equal(firstDarkVisit.root.dataset.themeVariant, "night");
assert.equal(firstDarkVisit.store.get(hostThemeVariantKey), "night");

const hostPaperOnDarkSystem = bootTheme({ host: "paper", light: false });
assert.equal(hostPaperOnDarkSystem.root.dataset.themeVariant, "paper");
assert.equal(hostPaperOnDarkSystem.root.style.colorScheme, "light");

const legacyPaperOnly = bootTheme({ legacy: "paper", light: false });
assert.equal(legacyPaperOnly.root.dataset.themeVariant, "paper");
assert.equal(legacyPaperOnly.store.get(hostThemeVariantKey), "paper");

const invalidHostValue = bootTheme({ host: "sepia", light: true });
assert.equal(invalidHostValue.root.dataset.themeVariant, "paper");
assert.notEqual(invalidHostValue.root.dataset.themeVariant, "sepia");
assert.equal(invalidHostValue.store.get(hostThemeVariantKey), "paper");

const invalidOnDarkSystem = bootTheme({ host: "sepia", legacy: "lime", light: false });
assert.equal(invalidOnDarkSystem.root.dataset.themeVariant, "night");

const hostWinsOverLegacy = bootTheme({ host: "night", legacy: "paper", light: true });
assert.equal(hostWinsOverLegacy.root.dataset.themeVariant, "night");
assert.equal(hostWinsOverLegacy.store.get(hostThemeVariantKey), "night");

const legacyDoesNotOverrideHost = bootTheme({ host: "paper", legacy: "night", light: false });
assert.equal(legacyDoesNotOverrideHost.root.dataset.themeVariant, "paper");

const throwingStorage = (() => {
  const rootNode = { dataset: {}, style: {} };
  vm.runInNewContext(themeBootstrapSource, {
    localStorage: {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    },
    window: { matchMedia: () => ({ matches: true }) },
    document: { documentElement: rootNode },
  });
  return rootNode;
})();
assert.equal(throwingStorage.dataset.themeVariant, "night");
assert.equal(throwingStorage.style.colorScheme, "dark");

const throwingGetter = (() => {
  const rootNode = { dataset: {}, style: {} };
  vm.runInNewContext(themeBootstrapSource, {
    get localStorage() {
      throw new Error("denied");
    },
    window: { matchMedia: () => ({ matches: true }) },
    document: { documentElement: rootNode },
  });
  return rootNode;
})();
assert.equal(throwingGetter.dataset.themeVariant, "night");
assert.equal(throwingGetter.style.colorScheme, "dark");

const writeDenied = (() => {
  const rootNode = { dataset: {}, style: {} };
  vm.runInNewContext(themeBootstrapSource, {
    localStorage: {
      getItem: () => null,
      setItem: () => {
        throw new Error("denied");
      },
    },
    window: { matchMedia: () => ({ matches: true }) },
    document: { documentElement: rootNode },
  });
  return rootNode;
})();
assert.equal(writeDenied.dataset.themeVariant, "night");
assert.equal(writeDenied.style.colorScheme, "dark");

const paperRule = startupStyleSource.match(
  /html\[data-theme-variant="paper"\],html\[data-theme-variant="paper"\] body\{background:(#[0-9a-f]{6})/u,
);
assert.equal(paperRule?.[1], "#f3f1e8");
assert.equal(paperRule?.[1] === "#0b0d16", false);

const root = await mkdtemp(resolve(tmpdir(), "tao3k-local-host-"));
const source = resolve(root, "source");
execFileSync("git", ["init", "--quiet", source]);
execFileSync("git", ["-C", source, "config", "user.email", "test@tao3k.invalid"]);
execFileSync("git", ["-C", source, "config", "user.name", "TAO3K test"]);
await writeFile(resolve(source, "package.json"), '{"name":"org-zhixing-fixture"}\n');
await writeFile(resolve(source, "index.html"), "<html><head></head><body></body></html>\n");
await writeFile(resolve(source, "package-lock.json"), "fixture-lock\n");
await mkdir(resolve(source, "node_modules/.bin"), { recursive: true });
await writeFile(resolve(source, "node_modules/.bin/rsbuild"), "fixture\n");
execFileSync("git", ["-C", source, "add", "package.json", "package-lock.json", "index.html"]);
execFileSync("git", ["-C", source, "commit", "--quiet", "-m", "fixture"]);
const revision = execFileSync("git", ["-C", source, "rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const packagePath = resolve(root, "site-package.json");
await writeFile(packagePath, JSON.stringify({ orgZhixing: { contract: { revision } } }));

const cacheRoot = resolve(root, "cache");
const prepared = await prepareLocalHost({ cacheRoot, packagePath, sourceRoot: source });
assert.equal(prepared, resolve(cacheRoot, revision));
assert.equal(
  execFileSync("git", ["-C", prepared, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  revision,
);
assert.equal(await prepareLocalHost({ cacheRoot, packagePath, sourceRoot: source }), prepared);
const preparedShell = await readFile(resolve(prepared, "index.html"), "utf8");
assert.match(preparedShell, /data-tao3k-startup="night"/);
assert.match(preparedShell, /data-tao3k-theme-bootstrap/);
assert.match(preparedShell, /org-zhixing:theme-variant:tao3k-site/);
assert.match(preparedShell, /tao3k-theme-variant/);
assert.match(preparedShell, /dataset\.themeVariant=variant/);
assert.match(preparedShell, /html,body\{background:#0b0d16;color:#eff0f7\}/);
assert.match(preparedShell, /html\[data-theme-variant="paper"\]/);
assert.match(preparedShell, /background:#f3f1e8/);
assert.doesNotMatch(preparedShell, /#080b0a/);
assert.ok(preparedShell.indexOf("data-tao3k-theme-bootstrap") < preparedShell.indexOf("</head>"));
assert.ok(
  preparedShell.indexOf("data-tao3k-theme-bootstrap") <
    preparedShell.indexOf('data-tao3k-startup="night"'),
);
assert.equal(withStartupCanvas(preparedShell), preparedShell);
assert.match(preparedShell, /data-tao3k-base-navigation/);
for (const [href, base, expected] of [
  ["/products/context-system", "/tao3k.site/", "/tao3k.site/products/context-system"],
  ["/", "/tao3k.site/", "/tao3k.site/"],
  ["/tao3k.site/platform", "/tao3k.site/", "/tao3k.site/platform"],
  ["/platform", "/", "/platform"],
  ["//example.com/x", "/tao3k.site/", "//example.com/x"],
  ["https://example.com/x", "/tao3k.site/", "https://example.com/x"],
  ["#section", "/tao3k.site/", "#section"],
])
  assert.equal(siteHrefForBase(href, base), expected);
assert.equal(
  siteHrefForBase("#section", "/tao3k.site/", "/tao3k.site/products/context-system"),
  "/tao3k.site/products/context-system#section",
);
assert.throws(() => withStartupCanvas("<html></html>"), /TAO3K-SHELL-E001/);
assert.equal(
  await prepareLocalHost({ cacheRoot, hostOverride: prepared, packagePath, sourceRoot: source }),
  prepared,
);

console.log("tao3k-local-host-check status=ok");
