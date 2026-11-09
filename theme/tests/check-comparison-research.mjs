import assert from "node:assert/strict";
import { comparisonTopics } from "../src/pages/comparison/comparison-catalog.ts";
import { comparisonResearch } from "../src/pages/comparison/comparison-research.ts";

const separatelyCurated = new Set(["infrastructure", "agentic-ai-lab", "weaver"]);
for (const topic of comparisonTopics) {
  if (separatelyCurated.has(topic.id)) continue;
  const entry = comparisonResearch[topic.id];
  assert.ok(entry, `Missing comparison research: ${topic.id}`);
  for (const value of [entry.scenario, entry.ours, entry.boundary, entry.ownSource.name])
    assert.ok(value.trim(), `Empty evidence: ${topic.id}`);
  assert.ok(entry.matrix?.rows.length >= 3, `Missing comparison matrix: ${topic.id}`);
  assert.ok(entry.comparisons.length, `Missing reference: ${topic.id}`);
  for (const source of [entry.ownSource, ...entry.comparisons.map((item) => item.source)])
    assert.equal(new URL(source.url).protocol, "https:");
  for (const item of entry.comparisons) {
    assert.ok(item.use.trim());
    assert.ok(item.contrast.trim());
  }
}
console.log(`comparison-research status=ok researched=${Object.keys(comparisonResearch).length}`);
