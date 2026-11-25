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
assert.equal(resolveThemeChoice("night", "paper", true), "night");
assert.equal(resolveThemeChoice("paper", "night", false), "paper");
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

systemLight = true;
store.set(hostThemeVariantKey, "night");
store.set(legacyThemeVariantKey, "paper");
assert.equal(resolveThemeVariant(), "night");

systemLight = false;
store.set(hostThemeVariantKey, "paper");
store.set(legacyThemeVariantKey, "night");
assert.equal(resolveThemeVariant(), "paper");
assert.equal(readStoredThemeVariant(), "paper");

store.set(hostThemeVariantKey, "not-a-variant");
store.set(legacyThemeVariantKey, "paper");
systemLight = false;
assert.equal(resolveThemeVariant(), "paper");
assert.equal(readStoredThemeVariant(), "paper");

store.clear();
systemLight = true;
assert.equal(resolveThemeVariant(), "paper");
store.clear();
systemLight = false;
assert.equal(resolveThemeVariant(), "night");

const throwingStore = {
  getItem: () => {
    throw new Error("denied");
  },
  setItem: () => {
    throw new Error("denied");
  },
};
globalThis.localStorage = throwingStore;
systemLight = true;
assert.equal(resolveThemeVariant(), "night");
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => {
    store.set(key, value);
  },
};

applyThemeVariant("paper", true);
assert.equal(root.dataset.themeVariant, "paper");
assert.equal(root.dataset.theme, "tao3k-site");
assert.equal(root.style.colorScheme, "light");
assert.equal(store.get(hostThemeVariantKey), "paper");
assert.equal(resolveThemeVariant(), "paper");

console.log("tao3k-theme-mode-check status=ok");
