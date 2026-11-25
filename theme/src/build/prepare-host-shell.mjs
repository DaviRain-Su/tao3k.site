import { readFile, writeFile } from "node:fs/promises";
import {
  hostThemeVariantKey,
  legacyThemeVariantKey,
  readBootVariant,
  resolveThemeChoice,
} from "../theme-variant.mjs";

const marker = 'data-tao3k-startup="night"';
export const themeBootstrapSource = `(function(){${resolveThemeChoice.toString()}${readBootVariant.toString()}var storage=null;try{storage=localStorage;}catch(e){}var systemLight=false;try{systemLight=window.matchMedia("(prefers-color-scheme: light)").matches;}catch(e){}var variant=readBootVariant(storage,systemLight,${JSON.stringify(hostThemeVariantKey)},${JSON.stringify(legacyThemeVariantKey)});var root=document.documentElement;root.dataset.theme="tao3k-site";root.dataset.themeVariant=variant;root.style.colorScheme=variant==="paper"?"light":"dark";})();`;
export const startupStyleSource =
  'html,body{background:#080b0a;color:#eef2ec}html[data-theme-variant="paper"],html[data-theme-variant="paper"] body{background:#f3f1e8;color:#1a211c}html[data-theme-variant="night"],html[data-theme-variant="night"] body{background:#080b0a;color:#eef2ec}html[data-theme-variant="paper"]:has([data-theme-runtime-state="pending"]),html[data-theme-variant="paper"]:has([data-theme-runtime-state="pending"]) body,html[data-theme-variant="paper"]:has([data-theme-runtime-state="loading"]),html[data-theme-variant="paper"]:has([data-theme-runtime-state="loading"]) body,html[data-theme-variant="paper"]:has([data-theme-runtime-state="mounting"]),html[data-theme-variant="paper"]:has([data-theme-runtime-state="mounting"]) body{background:#f3f1e8!important;color:#1a211c!important}html[data-theme-variant="night"]:has([data-theme-runtime-state="pending"]),html[data-theme-variant="night"]:has([data-theme-runtime-state="pending"]) body,html[data-theme-variant="night"]:has([data-theme-runtime-state="loading"]),html[data-theme-variant="night"]:has([data-theme-runtime-state="loading"]) body,html[data-theme-variant="night"]:has([data-theme-runtime-state="mounting"]),html[data-theme-variant="night"]:has([data-theme-runtime-state="mounting"]) body{background:#080b0a!important;color:#eef2ec!important}';
const themeBootstrap = `<script data-tao3k-theme-bootstrap>${themeBootstrapSource}</script>`;
const startupStyle = `<style ${marker}>${startupStyleSource}</style>`;
const startupHead = `${themeBootstrap}\n${startupStyle}`;

// Federated routes are authored from the site root. A Pages project is hosted
// under a base path, so keep links within that base without changing external URLs.
export function siteHrefForBase(href, base, currentPath = "") {
  if (href?.startsWith("#") && currentPath) return `${currentPath}${href}`;
  if (!href?.startsWith("/") || href.startsWith("//")) return href;
  const prefix = base === "/" ? "" : base.replace(/\/+$/u, "");
  if (
    !prefix ||
    href === prefix ||
    href.startsWith(`${prefix}/`) ||
    href.startsWith(`${prefix}#`) ||
    href.startsWith(`${prefix}?`)
  )
    return href;
  return `${prefix}${href}`;
}

const baseNavigation = `<script data-tao3k-base-navigation>${siteHrefForBase.toString()};(()=>{const base=document.querySelector("base")?.getAttribute("href");if(!base)return;const fix=a=>{const old=a.getAttribute("href"),next=siteHrefForBase(old,base,location.pathname+location.search);if(next!==old)a.setAttribute("href",next)};const scan=node=>{if(node.nodeType!==1)return;if(node.matches("a[href]"))fix(node);node.querySelectorAll("a[href]").forEach(fix)};document.addEventListener("click",event=>{const a=event.target instanceof Element?event.target.closest("a[href]"):null;if(a)fix(a)},true);new MutationObserver(records=>records.forEach(record=>{if(record.type==="attributes")scan(record.target);else record.addedNodes.forEach(scan)})).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["href"]});document.addEventListener("DOMContentLoaded",()=>scan(document.documentElement),{once:true})})();</script>`;

/** Paint the saved or preferred canvas before the federated theme can load. */
export function withStartupCanvas(html) {
  if (!html.includes("</head>")) throw new Error("TAO3K-SHELL-E001 missing closing head");
  const stripped = html
    .replace(/<script data-tao3k-theme-bootstrap>[\s\S]*?<\/script>\n?/gu, "")
    .replace(/<style data-tao3k-startup="night">[\s\S]*?<\/style>\n?/gu, "")
    .replace(/<script data-tao3k-base-navigation>[\s\S]*?<\/script>\n?/gu, "");
  return stripped.replace("</head>", `${startupHead}\n${baseNavigation}\n</head>`);
}

export async function prepareHostShell(path) {
  const original = await readFile(path, "utf8");
  const updated = withStartupCanvas(original);
  if (updated !== original) await writeFile(path, updated);
}
