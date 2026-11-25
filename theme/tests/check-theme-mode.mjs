import assert from "node:assert/strict";
import {
  applyThemeVariant,
  readStoredThemeVariant,
  resolveThemeVariant,
  themeVariantStorageKey,
} from "../src/theme-mode.ts";
import {
  hostThemeVariantKey,
  legacyThemeVariantKey,
  resolveThemeChoice,
} from "../src/theme-variant.mjs";

assert.equal(themeVariantStorageKey, hostThemeVariantKey);
assert.equal(resolveThemeChoice("paper", "night", false), "paper");
assert.equal(resolveThemeChoice("night", "paper", true), "night");
assert.equal(resolveThemeChoice("sepia", "paper", false), "paper");
assert.equal(resolveThemeChoice("sepia", "nope", true), "paper");
assert.equal(resolveThemeChoice("sepia", "nope", false), "night");
assert.equal(resolveThemeChoice(null, null, true), "paper");
assert.equal(resolveThemeChoice(null, null, false), "night");
assert.notEqual(resolveThemeChoice("sepia", null, false), "sepia");

const store = new Map();
const root = { dataset: {}, style: {} };
let systemLight = false;
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => {
    store.set(key, value);
  },
};
globalThis.document = { documentElement: root };
globalThis.window = { matchMedia: () => ({ matches: systemLight }) };

systemLight = false;
store.set(hostThemeVariantKey, "paper");
assert.equal(resolveThemeVariant(), "paper");
assert.equal(readStoredThemeVariant(), "paper");

store.set(hostThemeVariantKey, "not-a-variant");
store.set(legacyThemeVariantKey, "paper");
systemLight = false;
assert.equal(resolveThemeVariant(), "paper");
assert.equal(readStoredThemeVariant(), null);

store.clear();
systemLight = true;
assert.equal(resolveThemeVariant(), "paper");
systemLight = false;
assert.equal(resolveThemeVariant(), "night");

applyThemeVariant("paper", true);
assert.equal(root.dataset.themeVariant, "paper");
assert.equal(root.dataset.theme, "tao3k-site");
assert.equal(root.style.colorScheme, "light");
assert.equal(store.get(hostThemeVariantKey), "paper");
assert.equal(resolveThemeVariant(), "paper");

console.log("tao3k-theme-mode-check status=ok");
