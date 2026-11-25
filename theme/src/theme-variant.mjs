/** Host Org Zhixing persists the choice under this key and reapplies it on mount. */
export const hostThemeVariantKey = "org-zhixing:theme-variant:tao3k-site";

/** Earlier preview builds wrote this key. It is read only when the host key is absent. */
export const legacyThemeVariantKey = "tao3k-theme-variant";

export function isThemeVariant(value) {
  return value === "night" || value === "paper";
}

/**
 * A valid host choice wins, even when the legacy key disagrees.
 * Any other stored value is ignored. Light preference is paper.
 */
export function resolveThemeChoice(hostStored, legacyStored, systemLight) {
  if (hostStored === "night" || hostStored === "paper") return hostStored;
  if (legacyStored === "night" || legacyStored === "paper") return legacyStored;
  return systemLight ? "paper" : "night";
}

/** Storage failures fall through to the system preference. The choice is still returned. */
export function readBootVariant(storage, systemLight, hostKey, legacyKey) {
  let hostStored = null;
  let legacyStored = null;
  if (storage) {
    try {
      hostStored = storage.getItem(hostKey);
    } catch {
      hostStored = null;
    }
    try {
      legacyStored = storage.getItem(legacyKey);
    } catch {
      legacyStored = null;
    }
  }
  const variant = resolveThemeChoice(hostStored, legacyStored, systemLight);
  if (storage) {
    try {
      if (hostStored !== variant) storage.setItem(hostKey, variant);
    } catch {
      /* The document attribute is still set by the caller. */
    }
  }
  return variant;
}
