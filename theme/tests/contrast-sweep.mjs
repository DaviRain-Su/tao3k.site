#!/usr/bin/env node
/**
 * Compare text contrast below 2:1 on two assembled Pages origins.
 *
 * Usage:
 *   node --experimental-strip-types theme/tests/contrast-sweep.mjs \
 *     --main http://127.0.0.1:4180/tao3k.site/ \
 *     --head http://127.0.0.1:4181/tao3k.site/
 *
 * Each origin must be the Org Zhixing Pages host at
 * 32464173c42948d657118532afabbddf918eb8d6 with --base /tao3k.site.
 * The theme directory behind that host is swapped per origin.
 *
 * A pair is one visible text element whose computed color contrasts
 * less than 2:1 with the nearest opaque background. Identity is
 * theme + route + tag + class + the first 40 characters of text.
 * A pair is NEW when that identity fails on head and did not fail on main.
 * Groups collapse pairs by theme + class (or tag).
 */
import puppeteer from "puppeteer-core";
import { siteRouteIds } from "../src/site-routes.ts";

const args = process.argv.slice(2);
const readArg = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? "" : args[index + 1] || "";
};
const mainOrigin = readArg("--main");
const headOrigin = readArg("--head");
if (!mainOrigin || !headOrigin) {
  console.error("usage: node theme/tests/contrast-sweep.mjs --main URL --head URL");
  process.exit(1);
}

const routes = ["/", ...siteRouteIds.map((id) => `/${id}`)];
const themes = ["paper", "night"];

const measure = async (page, origin) => {
  const failures = [];
  for (const theme of themes) {
    for (const route of routes) {
      const url = new URL(route.replace(/^\//, ""), origin.endsWith("/") ? origin : `${origin}/`)
        .href;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.evaluate((next) => {
        localStorage.setItem("org-zhixing:theme-variant:tao3k-site", next);
      }, theme);
      await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
      await page
        .waitForFunction(
          () =>
            document
              .querySelector("[data-theme-runtime-state]")
              ?.getAttribute("data-theme-runtime-state") === "mounted" ||
            document.querySelector(".tao3k-header"),
          { timeout: 20000 },
        )
        .catch(() => {});
      await page.evaluate(() => {
        document.documentElement.dataset.themeVariant =
          localStorage.getItem("org-zhixing:theme-variant:tao3k-site") || "night";
        for (const menu of document.querySelectorAll(
          ".tao3k-products-menu, .tao3k-platform-menu",
        )) {
          menu.classList.add("is-open");
        }
      });
      const rows = await page.evaluate(
        (themeName, routePath) => {
          const parse = (value) => {
            const match = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (!match) return null;
            const alpha = match[4] === undefined ? 1 : Number(match[4]);
            if (alpha < 0.25) return null;
            return [Number(match[1]), Number(match[2]), Number(match[3])];
          };
          const lum = ([r, g, b]) => {
            const channel = (value) => {
              const scaled = value / 255;
              return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
            };
            return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
          };
          const ratio = (foreground, background) => {
            const left = lum(foreground);
            const right = lum(background);
            const lighter = Math.max(left, right);
            const darker = Math.min(left, right);
            return (lighter + 0.05) / (darker + 0.05);
          };
          const backgroundOf = (node) => {
            let current = node;
            while (current) {
              const color = parse(getComputedStyle(current).backgroundColor);
              if (color) return color;
              current = current.parentElement;
            }
            const canvas = themeName === "paper" ? [243, 241, 232] : [8, 11, 10];
            return canvas;
          };
          const found = [];
          const selector = "body *";
          for (const node of document.querySelectorAll(selector)) {
            if (node.closest("script, style, noscript")) continue;
            const text = (node.innerText || "").replace(/\s+/g, " ").trim();
            if (!text) continue;
            const style = getComputedStyle(node);
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              Number(style.opacity) === 0
            )
              continue;
            const foreground = parse(style.color);
            if (!foreground) continue;
            const background = backgroundOf(node);
            const value = ratio(foreground, background);
            if (value >= 2) continue;
            const className = String(node.className || "");
            found.push({
              theme: themeName,
              route: routePath,
              tag: node.tagName,
              className,
              text: text.slice(0, 40),
              contrast: Number(value.toFixed(2)),
            });
          }
          return found;
        },
        theme,
        route,
      );
      failures.push(...rows);
    }
  }
  return failures;
};

const identity = (row) => `${row.theme}\t${row.route}\t${row.tag}\t${row.className}\t${row.text}`;
const groupOf = (row) => `${row.theme}\t${row.className || row.tag}`;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const mainFailures = await measure(page, mainOrigin);
const headFailures = await measure(page, headOrigin);
await browser.close();

const mainIds = new Set(mainFailures.map(identity));
const added = headFailures.filter((row) => !mainIds.has(identity(row)));
const addedGroups = new Set(added.map(groupOf));
const count = (rows, theme) => rows.filter((row) => row.theme === theme).length;
const summary = {
  routes: routes.length,
  paper: { main: count(mainFailures, "paper"), head: count(headFailures, "paper") },
  night: { main: count(mainFailures, "night"), head: count(headFailures, "night") },
  newPairs: added.length,
  newGroups: addedGroups.size,
  newPaper: added.filter((row) => row.theme === "paper").length,
  newNight: added.filter((row) => row.theme === "night").length,
};
console.log(JSON.stringify(summary, null, 2));
if (added.length) {
  console.log("NEW");
  for (const row of added.slice(0, 80)) {
    console.log(
      `${row.contrast}\t${row.theme}\t${row.route}\t${row.className || row.tag}\t${row.text}`,
    );
  }
}
if (summary.newPaper > 0 || summary.newNight > 0 || summary.night.head > summary.night.main) {
  process.exitCode = 1;
}
