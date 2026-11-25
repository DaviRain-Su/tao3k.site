#!/usr/bin/env node
/**
 * Assembled Pages checks the bootstrap tests cannot see.
 *
 * Not part of CI. Point it at a Pages host built with this theme:
 *
 *   node theme/tests/check-theme-host-page.mjs --origin http://127.0.0.1:4181/tao3k.site/
 *
 * Storage reads that throw follow the host: ThemeRootLayout falls back to
 * the configured night variant. The first paint must already be night, so
 * the document does not flip after mount. The header toggle must call
 * applyThemeVariant even when the host's variant buttons are gone.
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

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
await page.evaluateOnNewDocument(() => {
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
      deny();
      return 0;
    },
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get: () => storage,
  });
  window.__themeSamples = [];
  const record = () => {
    window.__themeSamples.push({
      variant: document.documentElement.dataset.themeVariant || "",
      background: getComputedStyle(document.body).backgroundColor,
    });
  };
  new MutationObserver(record).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme-variant"],
  });
  record();
});
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
const storageResult = await page.evaluate(() => ({
  samples: window.__themeSamples,
  variant: document.documentElement.dataset.themeVariant,
  background: getComputedStyle(document.body).backgroundColor,
}));
const variants = storageResult.samples.map((sample) => sample.variant).filter(Boolean);
assert.equal(storageResult.variant, "night");
assert.equal(variants.includes("paper"), false, JSON.stringify(storageResult.samples));
assert.equal(storageResult.background, "rgb(8, 11, 10)");

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
console.log("tao3k-theme-host-page status=ok storage=night toggle=applied");
