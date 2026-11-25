export const hostThemeVariantKey: string;
export const legacyThemeVariantKey: string;

export type ThemeVariant = "night" | "paper";

export function isThemeVariant(value: string | null | undefined): value is ThemeVariant;

export function resolveThemeChoice(
  hostStored: string | null | undefined,
  legacyStored: string | null | undefined,
  systemLight: boolean,
): ThemeVariant;
