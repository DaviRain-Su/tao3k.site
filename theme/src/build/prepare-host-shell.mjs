import { readFile, writeFile } from "node:fs/promises";

const marker = 'data-tao3k-startup="night"';
const startupStyle = `<style ${marker}>html,body{background:#0b0d16;color:#edf0fa}html:has([data-theme-runtime-state="pending"]),html:has([data-theme-runtime-state="pending"]) body,html:has([data-theme-runtime-state="loading"]),html:has([data-theme-runtime-state="loading"]) body,html:has([data-theme-runtime-state="mounting"]),html:has([data-theme-runtime-state="mounting"]) body{background:#0b0d16!important}</style>`;

/** Paint the site's default canvas before the federated theme can load. */
export function withStartupCanvas(html) {
  if (html.includes(marker)) {
    return html.replace(/<style data-tao3k-startup="night">[\s\S]*?<\/style>/u, startupStyle);
  }
  if (!html.includes("</head>")) throw new Error("TAO3K-SHELL-E001 missing closing head");
  return html.replace("</head>", `${startupStyle}\n</head>`);
}

export async function prepareHostShell(path) {
  const original = await readFile(path, "utf8");
  const updated = withStartupCanvas(original);
  if (updated !== original) await writeFile(path, updated);
}
