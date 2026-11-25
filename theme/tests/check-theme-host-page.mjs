#!/usr/bin/env node
/**
 * Assembled Pages checks the bootstrap tests cannot see.
 *
 * Not part of CI. Point it at a Pages host built with this theme:
 *
 *   node theme/tests/check-theme-host-page.mjs --origin http://127.0.0.1:4181/tao3k.site/
 *
 * The sampler starts as soon as documentElement exists and keeps a frame
 * log through mount. A paper sample fails the run. getItem failures and
 * setItem failures both stay on the host's night fallback. The header
 * toggle must call applyThemeVariant even when the host's variant buttons
 * are gone.
 */
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const args = process.argv.slice(2);
const originFlag = args.indexOf("--origin");
const origin = originFlag === -1 ? "" : args[originFlag + 1] || "";
if (!origin) {
  console.error("usage: node theme/tests/check-theme-host-page.mjs --origin URL");
  process.exit(1);
}

const paperBackground = "rgb(243, 241, 232)";

const installSampler = () => {
  window.__themeSamples = [];
  const record = () => {
    const root = document.documentElement;
    if (!root) return;
    const body = document.body;
    window.__themeSamples.push({
      t: Math.round(performance.now()),
      variant: root.dataset.themeVariant || "",
      background: body ? getComputedStyle(body).backgroundColor : "",
    });
  };
  const arm = () => {
    const root = document.documentElement;
    if (!root || root.dataset.themeSampleArmed === "true") return;
    root.dataset.themeSampleArmed = "true";
    record();
    new MutationObserver(record).observe(root, {
      attributes: true,
      attributeFilter: ["data-theme-variant"],
    });
    const frames = { count: 0 };
    const tick = () => {
      record();
      frames.count += 1;
      if (frames.count < 40) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (document.documentElement) arm();
  document.addEventListener("readystatechange", arm);
  new MutationObserver(arm).observe(document, { childList: true, subtree: true });
};

const assertNightFromFirstPaint = (samples, label) => {
  assert.ok(samples.length > 0, `${label} collected no theme samples`);
  const painted = samples.filter((sample) => sample.variant || sample.background);
  assert.ok(painted.length > 0, `${label} collected no painted samples`);
  const paper = painted.filter(
    (sample) => sample.variant === "paper" || sample.background === paperBackground,
  );
  assert.deepEqual(
    paper,
    [],
    `${label} painted paper before the host settled: ${JSON.stringify(samples)}`,
  );
};

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const loadWithStorage = async (storageFactorySource) => {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await page.evaluateOnNewDocument(installSampler);
  await page.evaluateOnNewDocument(storageFactorySource);
  await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page
    .waitForFunction(
      () =>
        document
          .querySelector("[data-theme-runtime-state]")
          ?.getAttribute("data-theme-runtime-state") === "mounted",
      { timeout: 20000 },
    )
    .catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 800));
  const result = await page.evaluate(() => ({
    samples: window.__themeSamples,
    variant: document.documentElement.dataset.themeVariant,
    background: getComputedStyle(document.body).backgroundColor,
  }));
  await page.close();
  return result;
};

const deniedStorage = () => {
  const deny = () => {
    throw new DOMException("denied", "SecurityError");
  };
  const storage = {
    getItem: deny,
    setItem: deny,
    removeItem: deny,
    clear: deny,
    key: deny,
    get length() {
      return 0;
    },
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get: () => storage,
  });
};

const writeDeniedStorage = () => {
  const storage = {
    getItem: () => null,
    setItem: () => {
      throw new DOMException("denied", "QuotaExceededError");
    },
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    get length() {
      return 0;
    },
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get: () => storage,
  });
};

const readDenied = await loadWithStorage(deniedStorage);
assert.equal(readDenied.variant, "night");
assert.equal(readDenied.background, "rgb(8, 11, 10)");
assertNightFromFirstPaint(readDenied.samples, "getItem throw");

const writeDenied = await loadWithStorage(writeDeniedStorage);
assert.equal(writeDenied.variant, "night");
assert.equal(writeDenied.background, "rgb(8, 11, 10)");
assertNightFromFirstPaint(writeDenied.samples, "setItem throw");

const togglePage = await browser.newPage();
await togglePage.goto(origin, { waitUntil: "networkidle0", timeout: 30000 });
await togglePage.waitForSelector(".tao3k-mode-toggle", { timeout: 20000 });
const before = await togglePage.evaluate(
  () => document.documentElement.dataset.themeVariant || "night",
);
await togglePage.evaluate(() => {
  for (const node of document.querySelectorAll("[data-theme-variant-option]")) node.remove();
});
await togglePage.click(".tao3k-mode-toggle");
const after = await togglePage.evaluate(() => ({
  variant: document.documentElement.dataset.themeVariant,
  stored: localStorage.getItem("org-zhixing:theme-variant:tao3k-site"),
}));
assert.notEqual(after.variant, before);
assert.equal(after.stored, after.variant);
await browser.close();
const firstPaint = (samples) => samples.find((sample) => sample.variant) ?? samples[0];
console.log(
  `tao3k-theme-host-page status=ok readDeniedSamples=${readDenied.samples.length} readFirst=${JSON.stringify(firstPaint(readDenied.samples))} writeDeniedSamples=${writeDenied.samples.length} writeFirst=${JSON.stringify(firstPaint(writeDenied.samples))} toggle=applied`,
);
