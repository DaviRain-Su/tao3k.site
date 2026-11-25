export const themeBootstrapSource: string;
export const startupStyleSource: string;

export function siteHrefForBase(href: string, base: string, currentPath?: string): string;

export function withStartupCanvas(html: string): string;

export function prepareHostShell(path: string): Promise<void>;
