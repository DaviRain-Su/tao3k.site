export const themeVariantStorageKey = "tao3k-theme-variant";

export type ThemeVariant = "night" | "paper";

const isThemeVariant = (value: string | null | undefined): value is ThemeVariant =>
  value === "night" || value === "paper";

export function readStoredThemeVariant(): ThemeVariant | null {
  try {
    const stored = localStorage.getItem(themeVariantStorageKey);
    return isThemeVariant(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Stored choice wins. Otherwise keep an attribute already set, then follow the system. */
export function resolveThemeVariant(): ThemeVariant {
  const stored = readStoredThemeVariant();
  if (stored) return stored;
  const attribute = document.documentElement.dataset.themeVariant;
  if (isThemeVariant(attribute)) return attribute;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "paper";
  return "night";
}

export function applyThemeVariant(variant: ThemeVariant, persist: boolean): void {
  const root = document.documentElement;
  root.dataset.theme = "tao3k-site";
  root.dataset.themeVariant = variant;
  root.style.colorScheme = variant === "paper" ? "light" : "dark";
  if (!persist) return;
  try {
    localStorage.setItem(themeVariantStorageKey, variant);
  } catch {
    /* Private mode and quota failures still leave the document attribute set. */
  }
}
