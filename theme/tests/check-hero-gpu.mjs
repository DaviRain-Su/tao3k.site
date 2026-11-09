import assert from "node:assert/strict";
import { createHeroGpu } from "../src/hero-gpu.ts";

const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
const setGpu = (gpu) =>
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { gpu } });
const canvas = { getContext: () => ({ configure() {} }) };
const stage = {};
let ready = false;
const onReady = () => {
  ready = true;
};
const onFailure = () => {
  throw new Error("failure callback must only report a lost active device");
};

try {
  setGpu(undefined);
  assert.equal(await createHeroGpu(canvas, stage, onReady, onFailure), null);
  setGpu({ requestAdapter: async () => null });
  assert.equal(await createHeroGpu(canvas, stage, onReady, onFailure), null);
  let destroyed = false;
  const device = {
    createShaderModule: () => ({}),
    createRenderPipelineAsync: async () => {
      throw new Error("shader validation failed");
    },
    destroy: () => {
      destroyed = true;
    },
  };
  setGpu({
    requestAdapter: async () => ({ requestDevice: async () => device }),
    getPreferredCanvasFormat: () => "bgra8unorm",
  });
  assert.equal(await createHeroGpu(canvas, stage, onReady, onFailure), null);
  assert.equal(destroyed, true);
  assert.equal(ready, false);
} finally {
  if (original) Object.defineProperty(globalThis, "navigator", original);
  else delete globalThis.navigator;
}
console.log("tao3k-hero-gpu-initialization status=ok");
