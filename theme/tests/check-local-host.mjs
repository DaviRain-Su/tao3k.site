import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { prepareLocalHost } from "../src/build/prepare-local-host.mjs";
import { siteHrefForBase, withStartupCanvas } from "../src/build/prepare-host-shell.mjs";

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
assert.match(preparedShell, /html,body\{background:#0b0d16/);
assert.ok(preparedShell.indexOf('data-tao3k-startup="night"') < preparedShell.indexOf("</head>"));
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
