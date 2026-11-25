#!/usr/bin/env node
/**
 * Compare text contrast below 2:1 on two assembled Pages origins.
 *
 * Not part of CI. It needs Chrome and two built hosts:
 *
 *   node --experimental-strip-types theme/tests/contrast-sweep.mjs \
 *     --main http://127.0.0.1:4180/tao3k.site/ \
 *     --head http://127.0.0.1:4181/tao3k.site/
 *
 *   node theme/tests/contrast-sweep.mjs --probe
 *
 * Each origin must be the Org Zhixing Pages host at
 * 32464173c42948d657118532afabbddf918eb8d6 with --base /tao3k.site.
 * Routes are the application routes plus every document id in
 * org-zhixing.static.json. Menus, tabs, and the /principles Play /
 * Run proof / Step controls are real clicks.
 *
 * A pair is one visible text element whose composited color contrasts
 * less than 2:1 with a background. Foregrounds may be rgb, color(srgb),
 * or oklch, including alpha below 0.25. Backgrounds composite every
 * translucent layer and each gradient stop. Identity is theme + route +
 * state + tag + class + the first 40 characters of text. A pair is NEW
 * when that identity fails on head and did not fail on main.
 */
import puppeteer from "puppeteer-core";
import { siteRouteIds } from "../src/site-routes.ts";

const args = process.argv.slice(2);
const readArg = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? "" : args[index + 1] || "";
};
const probe = args.includes("--probe");
const mainOrigin = readArg("--main");
const headOrigin = readArg("--head");

const collectFailures = (themeName, routePath, stateName) => {
  const parseRgbChannel = (token) => {
    const value = token.trim();
    if (value.endsWith("%")) return (Number(value.slice(0, -1)) / 100) * 255;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };
  const parseSrgbChannel = (token) => {
    const value = token.trim();
    if (value.endsWith("%")) return (Number(value.slice(0, -1)) / 100) * 255;
    const number = Number(value);
    return Number.isFinite(number) ? number * 255 : null;
  };
  const parseAlpha = (token) => {
    if (token == null || token === "") return 1;
    const value = token.trim();
    if (value.endsWith("%")) return Number(value.slice(0, -1)) / 100;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };
  const oklchToRgb = (lightness, chroma, hue) => {
    const radians = ((hue % 360) * Math.PI) / 180;
    const a = chroma * Math.cos(radians);
    const b = chroma * Math.sin(radians);
    const lmsL = lightness + 0.3963377774 * a + 0.2158037573 * b;
    const lmsM = lightness - 0.1055613458 * a - 0.0638541728 * b;
    const lmsS = lightness - 0.0894841775 * a - 1.291485548 * b;
    const linearL = lmsL ** 3;
    const linearM = lmsM ** 3;
    const linearS = lmsS ** 3;
    const gamma = (channel) => {
      const clamped = Math.min(1, Math.max(0, channel));
      return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    };
    return {
      r: gamma(4.0767416621 * linearL - 3.3077115913 * linearM + 0.2309699292 * linearS) * 255,
      g: gamma(-1.2684380046 * linearL + 2.6097574011 * linearM - 0.3413193965 * linearS) * 255,
      b: gamma(-0.0041960863 * linearL - 0.7034186147 * linearM + 1.707614701 * linearS) * 255,
    };
  };
  const parseColor = (value) => {
    const text = String(value).trim();
    const rgb = text.match(
      /^rgba?\(\s*([0-9.]+%?)\s*[, ]\s*([0-9.]+%?)\s*[, ]\s*([0-9.]+%?)(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/u,
    );
    if (rgb) {
      const red = parseRgbChannel(rgb[1]);
      const green = parseRgbChannel(rgb[2]);
      const blue = parseRgbChannel(rgb[3]);
      const alpha = parseAlpha(rgb[4]);
      if (red == null || green == null || blue == null || alpha == null) return null;
      return { r: red, g: green, b: blue, a: alpha };
    }
    const srgb = text.match(
      /^color\(\s*srgb\s+([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/u,
    );
    if (srgb) {
      const red = parseSrgbChannel(srgb[1]);
      const green = parseSrgbChannel(srgb[2]);
      const blue = parseSrgbChannel(srgb[3]);
      const alpha = parseAlpha(srgb[4]);
      if (red == null || green == null || blue == null || alpha == null) return null;
      return { r: red, g: green, b: blue, a: alpha };
    }
    const oklab = text.match(
      /^oklab\(\s*([0-9.]+%?)\s+(-?[0-9.]+%?)\s+(-?[0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/u,
    );
    if (oklab) {
      const lightnessToken = oklab[1];
      const lightness = lightnessToken.endsWith("%")
        ? Number(lightnessToken.slice(0, -1)) / 100
        : Number(lightnessToken);
      const labA = Number(oklab[2]);
      const labB = Number(oklab[3]);
      const alpha = parseAlpha(oklab[4]);
      if (![lightness, labA, labB, alpha].every(Number.isFinite)) return null;
      const chroma = Math.hypot(labA, labB);
      const hue = (Math.atan2(labB, labA) * 180) / Math.PI;
      const converted = oklchToRgb(lightness, chroma, hue < 0 ? hue + 360 : hue);
      return { ...converted, a: alpha };
    }
    const oklch = text.match(
      /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+(-?[0-9.]+)(?:deg)?(?:\s*\/\s*([0-9.]+%?))?\s*\)$/u,
    );
    if (oklch) {
      const lightnessToken = oklch[1];
      const lightness = lightnessToken.endsWith("%")
        ? Number(lightnessToken.slice(0, -1)) / 100
        : Number(lightnessToken);
      const chromaToken = oklch[2];
      const chroma = chromaToken.endsWith("%")
        ? Number(chromaToken.slice(0, -1)) / 100
        : Number(chromaToken);
      const hue = Number(oklch[3]);
      const alpha = parseAlpha(oklch[4]);
      if (![lightness, chroma, hue, alpha].every(Number.isFinite)) return null;
      const converted = oklchToRgb(lightness, chroma, hue);
      return { ...converted, a: alpha };
    }
    const hex = text.match(/^#([0-9a-f]{3,8})$/iu);
    if (hex) {
      const raw = hex[1];
      const expand = raw.length <= 4 ? [...raw].map((char) => char + char).join("") : raw;
      const red = Number.parseInt(expand.slice(0, 2), 16);
      const green = Number.parseInt(expand.slice(2, 4), 16);
      const blue = Number.parseInt(expand.slice(4, 6), 16);
      const alpha = expand.length === 8 ? Number.parseInt(expand.slice(6, 8), 16) / 255 : 1;
      return { r: red, g: green, b: blue, a: alpha };
    }
    return null;
  };
  const colorsIn = (value) => {
    const found = [];
    const pattern =
      /(?:rgba?\([^)]+\)|color\(\s*srgb\s+[^)]+\)|oklab\([^)]+\)|oklch\([^)]+\)|#[0-9a-fA-F]{3,8})/gu;
    for (const match of String(value).matchAll(pattern)) {
      const color = parseColor(match[0]);
      if (color && color.a > 0) found.push(color);
    }
    return found;
  };
  const composite = (under, over) => {
    const alpha = over.a + under.a * (1 - over.a);
    if (alpha <= 0) return { r: 0, g: 0, b: 0, a: 0 };
    const channel = (overChannel, underChannel) =>
      (overChannel * over.a + underChannel * under.a * (1 - over.a)) / alpha;
    return {
      r: channel(over.r, under.r),
      g: channel(over.g, under.g),
      b: channel(over.b, under.b),
      a: alpha,
    };
  };
  const lum = (color) => {
    const channel = (value) => {
      const scaled = value / 255;
      return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  };
  const ratio = (foreground, background) => {
    const left = lum(foreground);
    const right = lum(background);
    const lighter = Math.max(left, right);
    const darker = Math.min(left, right);
    return (lighter + 0.05) / (darker + 0.05);
  };
  const canvas =
    themeName === "paper" ? { r: 243, g: 241, b: 232, a: 1 } : { r: 8, g: 11, b: 10, a: 1 };
  const ancestor = (node) => {
    let acc = canvas;
    const chain = [];
    let current = node.parentElement;
    while (current) {
      chain.push(current);
      current = current.parentElement;
    }
    for (const element of chain.reverse()) {
      const style = getComputedStyle(element);
      for (const stop of colorsIn(style.backgroundImage)) acc = composite(acc, stop);
      const color = parseColor(style.backgroundColor);
      if (color && color.a > 0) acc = composite(acc, color);
    }
    return acc;
  };
  const backgroundsOf = (node) => {
    const below = ancestor(node);
    const style = getComputedStyle(node);
    const color = parseColor(style.backgroundColor);
    const base = color && color.a > 0 ? composite(below, color) : below;
    const stops = colorsIn(style.backgroundImage).filter((stop) => stop.a > 0.05);
    if (!stops.length) return [base];
    return [base, ...stops.map((stop) => composite(base, stop))];
  };
  const found = [];
  for (const node of document.querySelectorAll("body *")) {
    if (node.closest("script, style, noscript, svg")) continue;
    const text = (node.innerText || "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0)
      continue;
    const foreground = parseColor(style.color);
    if (!foreground || foreground.a === 0) continue;
    let worst = Number.POSITIVE_INFINITY;
    for (const background of backgroundsOf(node)) {
      const blended = composite(background, foreground);
      worst = Math.min(worst, ratio(blended, background));
    }
    if (worst >= 2) continue;
    found.push({
      theme: themeName,
      route: routePath,
      state: stateName,
      tag: node.tagName,
      className: String(node.className || ""),
      text: text.slice(0, 40),
      contrast: Number(worst.toFixed(2)),
    });
  }
  return found;
};

const clickControl = (label) => {
  const button = [...document.querySelectorAll("button")].find(
    (node) => (node.innerText || "").replace(/\s+/g, " ").trim() === label,
  );
  if (!button || button.disabled) return false;
  button.click();
  return true;
};

const openMenus = () => {
  const triggers = [
    ...document.querySelectorAll(".tao3k-products-menu__trigger, .tao3k-platform-menu__trigger"),
  ];
  for (const trigger of triggers) trigger.click();
  return triggers.length > 0;
};

const clickTabs = () => {
  const tabs = [...document.querySelectorAll("[role='tab']")].slice(0, 4);
  const pressed = [];
  for (const tab of tabs) {
    tab.click();
    pressed.push((tab.innerText || "").replace(/\s+/g, " ").trim().slice(0, 24));
  }
  return pressed;
};

const identity = (row) =>
  `${row.theme}\t${row.route}\t${row.state}\t${row.tag}\t${row.className}\t${row.text}`;
const groupOf = (row) => `${row.theme}\t${row.state}\t${row.className || row.tag}`;

const launch = async () =>
  puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

const runProbe = async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html><body style="background:#111111;color:#eeeeee">
      <p id="srgb" style="color: color(srgb 0.93 0.91 0.86); background-color: #f3f1e8">srgb broken pair</p>
      <p id="oklch" style="color: oklch(0.97 0.01 140); background-color: oklch(0.95 0.01 140)">oklch broken pair</p>
      <p id="alpha" style="color: rgb(238 242 236 / 0.2); background-color: #eef2ec">alpha broken pair</p>
      <p id="gradient" style="color:#f4f1e8;background-color:transparent;background-image:linear-gradient(#f7f4ea,#f3f1e8)">gradient broken pair</p>
      <p id="ok" style="color:#111111;background-color:#ffffff">readable control pair</p>
    </body></html>`,
    { waitUntil: "domcontentloaded" },
  );
  const rows = await page.evaluate(collectFailures, "paper", "/probe", "injected");
  await browser.close();
  const texts = new Set(rows.map((row) => row.text));
  const expected = [
    "srgb broken pair",
    "oklch broken pair",
    "alpha broken pair",
    "gradient broken pair",
  ];
  const missed = expected.filter((text) => !texts.has(text));
  const flaggedControl = texts.has("readable control pair");
  console.log(JSON.stringify({ probeRows: rows.length, missed, flaggedControl }, null, 2));
  if (missed.length || flaggedControl) process.exitCode = 1;
};

if (probe) {
  await runProbe();
} else if (!mainOrigin || !headOrigin) {
  console.error(
    "usage: node --experimental-strip-types theme/tests/contrast-sweep.mjs --main URL --head URL",
  );
  process.exit(1);
} else {
  const routesFor = async (origin) => {
    const base = origin.endsWith("/") ? origin : `${origin}/`;
    const response = await fetch(new URL("org-zhixing.static.json", base));
    const payload = await response.json();
    const documents = Array.isArray(payload.sources)
      ? payload.sources.map((source) => `/${source.id}`)
      : [];
    return ["/", ...siteRouteIds.map((id) => `/${id}`), ...documents];
  };
  const only = readArg("--only");
  const discovered = [
    ...new Set([...(await routesFor(mainOrigin)), ...(await routesFor(headOrigin))]),
  ];
  const routes = only ? discovered.filter((route) => route === only) : discovered;
  const themes = ["paper", "night"];

  const measureOrigin = async (page, origin) => {
    const failures = [];
    for (const theme of themes) {
      for (const route of routes) {
        const url = new URL(route.replace(/^\//, ""), origin.endsWith("/") ? origin : `${origin}/`)
          .href;
        await page.emulateMediaFeatures([
          { name: "prefers-color-scheme", value: theme === "paper" ? "light" : "dark" },
        ]);
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        await page.evaluate((next) => {
          localStorage.setItem("org-zhixing:theme-variant:tao3k-site", next);
        }, theme);
        await page.reload({ waitUntil: "networkidle0", timeout: 30000 });
        await page
          .waitForFunction(
            () =>
              document
                .querySelector("[data-theme-runtime-state]")
                ?.getAttribute("data-theme-runtime-state") === "mounted" ||
              document.querySelector(".tao3k-header, article, h1"),
            { timeout: 20000 },
          )
          .catch(() => {});
        const snapshot = async (state) => {
          const rows = await page.evaluate(collectFailures, theme, route, state);
          failures.push(...rows);
        };
        await snapshot("rest");
        const opened = await page.evaluate(openMenus);
        if (opened) await snapshot("menus");
        const tabs = await page.evaluate(clickTabs);
        if (tabs.length) await snapshot(`tabs:${tabs.join("|")}`);
        if (route === "/principles") {
          const settle = () => new Promise((resolve) => setTimeout(resolve, 320));
          if (await page.evaluate(clickControl, "Play")) {
            await page.waitForSelector(".tao3k-principles-node", { timeout: 2000 }).catch(() => {});
            await settle();
            await snapshot("play");
          }
          if (await page.evaluate(clickControl, "Run proof")) {
            await page
              .waitForSelector(".proof-explorer__runtime[data-running='true']", { timeout: 2000 })
              .catch(() => {});
            await settle();
            await snapshot("run-proof");
          }
          if (await page.evaluate(clickControl, "Step")) {
            await settle();
            await snapshot("step");
          }
          const evidence = await page.evaluate(() => {
            const button = document.querySelector(".proof-evidence-map__items button");
            if (!button) return false;
            button.click();
            return true;
          });
          if (evidence) await snapshot("evidence");
        }
      }
    }
    return failures;
  };

  const browser = await launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  const mainFailures = await measureOrigin(page, mainOrigin);
  const headFailures = await measureOrigin(page, headOrigin);
  await browser.close();

  const mainIds = new Set(mainFailures.map(identity));
  const added = headFailures.filter((row) => !mainIds.has(identity(row)));
  const count = (rows, theme, route) =>
    rows.filter((row) => row.theme === theme && (route ? row.route === route : true)).length;
  const summary = {
    routes: routes.length,
    paper: { main: count(mainFailures, "paper"), head: count(headFailures, "paper") },
    night: { main: count(mainFailures, "night"), head: count(headFailures, "night") },
    principles: {
      paper: {
        main: count(mainFailures, "paper", "/principles"),
        head: count(headFailures, "paper", "/principles"),
      },
      night: {
        main: count(mainFailures, "night", "/principles"),
        head: count(headFailures, "night", "/principles"),
      },
    },
    newPairs: added.length,
    newGroups: new Set(added.map(groupOf)).size,
    newPaper: added.filter((row) => row.theme === "paper").length,
    newNight: added.filter((row) => row.theme === "night").length,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (added.length) {
    console.log("NEW");
    for (const row of added.slice(0, 80)) {
      console.log(
        `${row.contrast}\t${row.theme}\t${row.route}\t${row.state}\t${row.className || row.tag}\t${row.text}`,
      );
    }
  }
  const principlesRegressed =
    summary.principles.paper.head > summary.principles.paper.main ||
    summary.principles.night.head > summary.principles.night.main;
  if (
    summary.newPaper > 0 ||
    summary.newNight > 0 ||
    summary.night.head > summary.night.main ||
    principlesRegressed
  ) {
    process.exitCode = 1;
  }
}
