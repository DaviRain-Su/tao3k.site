import {
  hostThemeVariantKey,
  isThemeVariant,
  legacyThemeVariantKey,
  resolveThemeChoice,
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
  return resolveThemeChoice(
    readKey(hostThemeVariantKey),
    readKey(legacyThemeVariantKey),
    window.matchMedia("(prefers-color-scheme: light)").matches,
  );
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
