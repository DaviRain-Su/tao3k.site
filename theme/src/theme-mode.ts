import {
  hostThemeVariantKey,
  isThemeVariant,
  legacyThemeVariantKey,
  readBootVariant,
  type ThemeVariant,
} from "./theme-variant.mjs";

export const themeVariantStorageKey = hostThemeVariantKey;

export type { ThemeVariant };

const readKey = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export function readStoredThemeVariant(): ThemeVariant | null {
  const stored = readKey(hostThemeVariantKey);
  return isThemeVariant(stored) ? stored : null;
}

/** Host storage wins. Otherwise a legacy choice, then the system preference. */
export function resolveThemeVariant(): ThemeVariant {
  let systemLight = false;
  try {
    systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  } catch {
    systemLight = false;
  }
  let storage: Pick<Storage, "getItem" | "setItem"> | null = null;
  try {
    storage = localStorage;
  } catch {
    storage = null;
  }
  return readBootVariant(storage, systemLight, hostThemeVariantKey, legacyThemeVariantKey);
}

export function applyThemeVariant(variant: ThemeVariant, persist: boolean): void {
  const root = document.documentElement;
  root.dataset.theme = "tao3k-site";
  root.dataset.themeVariant = variant;
  root.style.colorScheme = variant === "paper" ? "light" : "dark";
  if (!persist) return;
  try {
    localStorage.setItem(hostThemeVariantKey, variant);
  } catch {
    /* Private mode and quota failures still leave the document attribute set. */
  }
}
