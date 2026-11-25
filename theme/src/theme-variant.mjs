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

/**
 * A storage read failure uses the host fallback. ThemeRootLayout does the
 * same when getItem throws. A write is also required when the host key is
 * missing or stale: if setItem throws, the host still reads no key and falls
 * back to night. The first paint uses that fallback so it does not flip.
 * A working store still prefers the system light choice.
 */
export function readBootVariant(storage, systemLight, hostKey, legacyKey, hostFallback) {
  const fallback = hostFallback === "paper" ? "paper" : "night";
  let hostStored = null;
  let legacyStored = null;
  let failed = storage == null;
  if (storage) {
    try {
      hostStored = storage.getItem(hostKey);
    } catch {
      failed = true;
    }
    try {
      legacyStored = storage.getItem(legacyKey);
    } catch {
      failed = true;
    }
  }
  if (failed) return fallback;
  const variant = resolveThemeChoice(hostStored, legacyStored, systemLight);
  if (hostStored === variant) return variant;
  try {
    storage.setItem(hostKey, variant);
  } catch {
    return fallback;
  }
  return variant;
}
