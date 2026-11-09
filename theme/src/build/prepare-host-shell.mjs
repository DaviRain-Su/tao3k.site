import { readFile, writeFile } from "node:fs/promises";

const marker = 'data-tao3k-startup="night"';
const startupStyle = `<style ${marker}>html,body{background:#0b0d16;color:#edf0fa}html:has([data-theme-runtime-state="pending"]),html:has([data-theme-runtime-state="pending"]) body,html:has([data-theme-runtime-state="loading"]),html:has([data-theme-runtime-state="loading"]) body,html:has([data-theme-runtime-state="mounting"]),html:has([data-theme-runtime-state="mounting"]) body{background:#0b0d16!important}</style>`;

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

/** Paint the site's default canvas before the federated theme can load. */
export function withStartupCanvas(html) {
  if (!html.includes("</head>")) throw new Error("TAO3K-SHELL-E001 missing closing head");
  const styled = html.includes(marker)
    ? html.replace(/<style data-tao3k-startup="night">[\s\S]*?<\/style>/u, startupStyle)
    : html.replace("</head>", `${startupStyle}\n</head>`);
  return styled.includes("data-tao3k-base-navigation")
    ? styled.replace(/<script data-tao3k-base-navigation>[\s\S]*?<\/script>/u, baseNavigation)
    : styled.replace("</head>", `${baseNavigation}\n</head>`);
}

export async function prepareHostShell(path) {
  const original = await readFile(path, "utf8");
  const updated = withStartupCanvas(original);
  if (updated !== original) await writeFile(path, updated);
}
