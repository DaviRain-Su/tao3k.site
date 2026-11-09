import assert from "node:assert/strict";
import { aitiaStory, codeStory } from "../src/components/flow-stories.ts";
import { defineLessonScene, resolveLessonFrame } from "../src/components/lesson-scene.ts";
import { aitiaLesson } from "../src/pages/products/aitia-lesson.ts";
import { codeFindings, codeLesson } from "../src/pages/products/code-lesson.ts";
import { lessonRoutePoints } from "../src/components/lesson-routing.ts";

for (const story of [aitiaStory, codeStory]) {
  const nodes = new Set(story.nodes.map((node) => node.id));
  const edges = new Set(story.edges.map((edge) => edge.id));
  assert.equal(nodes.size, story.nodes.length, `${story.id}: duplicate node`);
  assert.equal(edges.size, story.edges.length, `${story.id}: duplicate edge`);
  for (const edge of story.edges) {
    if (edge.from || edge.to) {
      assert.ok(
        nodes.has(edge.from) && nodes.has(edge.to),
        `${story.id}: edge endpoints must exist`,
      );
    }
  }
  assert.ok(story.phases.length > 1, `${story.id}: missing story phases`);
  for (const phase of story.phases) {
    for (const node of phase.activeNodes)
      assert.ok(nodes.has(node), `${story.id}: unknown node ${node}`);
    for (const edge of phase.activeEdges)
      assert.ok(edges.has(edge), `${story.id}: unknown edge ${edge}`);
    for (const transfer of phase.transfers ?? []) {
      assert.ok(
        phase.activeEdges.includes(transfer.edge),
        `${story.id}: transfer uses an inactive edge`,
      );
      assert.ok(transfer.label.trim(), `${story.id}: transfer needs a meaningful label`);
    }
  }
}
assert.equal(
  aitiaLesson.stages.length,
  aitiaStory.phases.length,
  "lesson and playback stages differ",
);
defineLessonScene(aitiaLesson);
defineLessonScene(codeLesson);
assert.throws(
  () =>
    defineLessonScene({
      ...aitiaLesson,
      relations: [{ ...aitiaLesson.relations[0], target: "missing" }],
    }),
  /Invalid lesson relation/,
);
assert.throws(
  () =>
    defineLessonScene({ ...aitiaLesson, relations: [{ ...aitiaLesson.relations[4], from: 1 }] }),
  /Invalid lesson relation/,
);
for (const actor of aitiaLesson.actors) {
  assert.equal(
    actor.poses[0].at,
    actor.from ?? 0,
    `${actor.id}: initial pose must match appearance`,
  );
  for (let i = 1; i < actor.poses.length; i++)
    assert.ok(
      actor.poses[i].at > actor.poses[i - 1].at,
      `${actor.id}: poses must be chronological`,
    );
}
for (const width of [272, 320, 390, 600, 619, 620, 799, 800, 900]) {
  const frames = aitiaLesson.stages.map((_, phase) =>
    resolveLessonFrame(aitiaLesson, phase, width, 100),
  );
  const actor = (phase, id) => frames[phase].actors.find((item) => item.id === id);
  assert.equal(actor(0, "gate").state, "default");
  assert.equal(actor(1, "gate").state, "closed");
  assert.ok(actor(1, "new-0").x > actor(0, "new-0").x, "new work approaches the gate");
  assert.equal(actor(2, "work-0").state, "running");
  assert.equal(actor(1, "model"), undefined);
  assert.equal(actor(2, "model").asset, "model");
  assert.equal(actor(0, "finding"), undefined);
  assert.equal(frames[0].relations.length, 3);
  assert.equal(frames[1].relations.find((item) => item.id === "entry-service").status, "blocked");
  assert.equal(frames[2].relations.find((item) => item.id === "work-model").status, "active");
  assert.equal(frames[3].relations.find((item) => item.id === "model-finding").status, "active");
  assert.equal(frames[4].relations.find((item) => item.id === "finding-review").status, "active");
  assert.equal(frames[4].relations.find((item) => item.id === "review-entry").kind, "feedback");
  assert.equal(
    frames[3].relations.find((item) => item.id === "model-finding").anchors.source,
    "right",
  );
  assert.equal(frames[2].relations.find((item) => item.id === "work-model").route, "approach");
  assert.equal(frames[2].relations.find((item) => item.id === "service-work").route, "direct");
  assert.equal(
    frames[4].relations.find((item) => item.id === "review-entry").route,
    width < 620 ? "around-top" : "around",
  );
  const review = actor(4, "review"),
    gate = actor(4, "gate");
  const dimensions =
    width < 620
      ? {
          review: [110, 64],
          model: [110, 64],
          gate: [60, 90],
          incoming: [100, 90],
          service: [110, 90],
          admitted: [100, 90],
          finding: [90, 64],
        }
      : {
          review: [130, 64],
          model: [130, 64],
          gate: [74, 100],
          incoming: [120, 100],
          service: [140, 100],
          admitted: [120, 100],
          finding: [84, 64],
        };
  const points = lessonRoutePoints(
    width < 620 ? "around-top" : "around",
    { x: review.x + dimensions.review[0] / 2, y: review.y + dimensions.review[1] },
    { x: gate.x + dimensions.gate[0] / 2, y: gate.y + (width < 620 ? 0 : dimensions.gate[1]) },
  );
  for (const obstruction of frames[4].actors.filter(
    (item) => item.id !== "review" && item.id !== "gate",
  )) {
    const [w, h] = dimensions[obstruction.asset];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      const intersects =
        a.x === b.x
          ? a.x > obstruction.x &&
            a.x < obstruction.x + w &&
            Math.min(a.y, b.y) < obstruction.y + h &&
            Math.max(a.y, b.y) > obstruction.y
          : a.y > obstruction.y &&
            a.y < obstruction.y + h &&
            Math.min(a.x, b.x) < obstruction.x + w &&
            Math.max(a.x, b.x) > obstruction.x;
      assert.ok(!intersects, `${width}px feedback crosses ${obstruction.id}`);
    }
  }
  for (const frame of frames) {
    assert.equal(new Set(frame.actors.map((item) => item.id)).size, frame.actors.length);
    assert.ok(frame.actors.every((item) => item.x >= 0 && item.x <= width));
    const sizes =
      width < 620
        ? {
            service: [110, 90],
            gate: [60, 90],
            incoming: [100, 90],
            admitted: [100, 90],
            finding: [90, 64],
            review: [110, 64],
            model: [110, 64],
          }
        : {
            service: [140, 100],
            gate: [74, 100],
            incoming: [120, 100],
            admitted: [120, 100],
            finding: [84, 64],
            review: [130, 64],
            model: [130, 64],
          };
    for (const item of frame.actors) {
      assert.ok(item.x + sizes[item.asset][0] <= width, `${width}px: ${item.id} exceeds the scene`);
    }
    for (let i = 0; i < frame.actors.length; i++)
      for (let j = i + 1; j < frame.actors.length; j++) {
        const a = frame.actors[i],
          b = frame.actors[j];
        const [aw, ah] = sizes[a.asset],
          [bw, bh] = sizes[b.asset];
        const overlaps = a.x < b.x + bw && a.x + aw > b.x && a.y < b.y + bh && a.y + ah > b.y;
        assert.ok(!overlaps, `${width}px: ${a.id} overlaps ${b.id}`);
      }
    const lookup = (id) => frame.actors.find((item) => item.id === id);
    if (width >= 600) {
      const extent = lookup("work-0").x + sizes.admitted[0] - lookup("new-0").x;
      assert.ok(
        extent >= width * 0.75,
        `${width}px: execution objects should use the available width`,
      );
    }
    assert.equal(lookup("new-0").y, lookup("gate").y, `${width}px: request and entry align`);
    assert.equal(lookup("service").y, lookup("work-0").y, `${width}px: execution row aligns`);
    if (width < 620) {
      assert.ok(lookup("service").y - lookup("gate").y >= 120, "mobile rows have breathing room");
      assert.ok(
        lookup("work-0").x - (lookup("service").x + sizes.service[0]) >= 16,
        "execution objects have a clear gap",
      );
    } else {
      assert.equal(lookup("gate").y, lookup("service").y, "desktop execution lane aligns");
    }
  }
}
assert.throws(() => resolveLessonFrame(aitiaLesson, 99, 320, 100), RangeError);
assert.throws(() => resolveLessonFrame(aitiaLesson, 0, 0, 100), RangeError);
const mediaScene = {
  stages: [{ description: "example" }],
  assets: { figure: { src: "/figure.webp", alt: "Example" } },
  actors: [{ id: "a", asset: "figure", poses: [{ at: 0, x: 0.5, dy: 0 }] }],
};
assert.deepEqual(
  resolveLessonFrame(mediaScene, 0, 320, 100).actors[0].media,
  mediaScene.assets.figure,
);
const unordered = {
  stages: [{ description: "a" }, { description: "b" }],
  actors: [
    {
      id: "a",
      asset: "figure",
      poses: [
        { at: 1, x: 0.8, dy: 0 },
        { at: 0, x: 0.2, dy: 0 },
      ],
    },
  ],
};
assert.equal(resolveLessonFrame(unordered, 1, 100, 0).actors[0].x, 80);
assert.throws(() => defineLessonScene(unordered), /requires input/);
assert.throws(
  () =>
    defineLessonScene({
      stages: [
        {
          description: "x",
          teaching: { input: "x", action: "y", output: "z", actors: ["missing"] },
        },
      ],
      actors: [],
    }),
  /unavailable actor/,
);
assert.equal(codeLesson.stages.length, codeStory.phases.length);
assert.equal(codeFindings.length, codeLesson.stages.length);
for (const width of [320, 900]) {
  const frames = codeLesson.stages.map((_, phase) =>
    resolveLessonFrame(codeLesson, phase, width, 125),
  );
  const actor = (phase, id) => frames[phase].actors.find((item) => item.id === id);
  assert.equal(actor(1, "context"), undefined);
  assert.equal(actor(2, "context").state, "current");
  assert.equal(actor(3, "tests").state, "current");
  for (let phase = 1; phase < frames.length; phase++) {
    assert.ok(actor(phase, codeFindings[phase].source), "each finding has a visible source");
    assert.ok(
      codeFindings[phase].file && codeFindings[phase].detail,
      "each finding has an example",
    );
  }
  assert.equal(frames[2].relations.length, 1);
  assert.equal(frames[3].relations.length, 2);
  assert.ok(actor(3, "lens").x > actor(1, "lens").x);
  const documents = frames[3].actors.filter((item) => item.asset !== "lens");
  for (let i = 1; i < documents.length; i++)
    assert.ok(
      documents[i].x >= documents[i - 1].x + (width < 480 ? 62 : 74),
      "documents must not overlap",
    );
}
console.log("tao3k-flow-stories status=ok stories=2");
