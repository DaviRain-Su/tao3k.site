/** Host Org Zhixing persists the choice under this key and reapplies it on mount. */
export const hostThemeVariantKey = "org-zhixing:theme-variant:tao3k-site";

/** Earlier preview builds wrote this key. It is read only when the host key is absent. */
export const legacyThemeVariantKey = "tao3k-theme-variant";

export function isThemeVariant(value) {
  return value === "night" || value === "paper";
}

/**
 * A valid host choice wins. A valid legacy choice is migrated.
 * Any other stored value is ignored and the system preference is used.
 * Light preference is paper. Anything else, including no preference, is night.
 */
export function resolveThemeChoice(hostStored, legacyStored, systemLight) {
  if (isThemeVariant(hostStored)) return hostStored;
  if (isThemeVariant(legacyStored)) return legacyStored;
  return systemLight ? "paper" : "night";
}
