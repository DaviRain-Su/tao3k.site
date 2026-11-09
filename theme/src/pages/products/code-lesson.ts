import type { LessonScene } from "../../components/lesson-scene";

/** An illustrative source investigation, not a live query result. */
export const codeLesson = {
  stages: [
    {
      description: "Begin with a question about a behavior.",
      teaching: {
        input: "Behavior question",
        action: "Scope search",
        output: "Investigation",
        actors: ["lens", "definition"],
      },
    },
    {
      description: "Find the definition and its source location.",
      flags: ["owner"],
      teaching: {
        input: "Search scope",
        action: "Locate definition",
        output: "Source location",
        actors: ["lens", "definition"],
      },
    },
    {
      description: "Follow the relevant calls and imports.",
      flags: ["owner", "context"],
      teaching: {
        input: "Definition",
        action: "Follow relationships",
        output: "Code context",
        actors: ["definition", "context"],
      },
    },
    {
      description: "Inspect the related tests before deciding what to change.",
      flags: ["owner", "context", "tests"],
      teaching: {
        input: "Code context",
        action: "Inspect tests",
        output: "Review evidence",
        actors: ["context", "tests"],
      },
    },
  ],
  actors: [
    {
      id: "definition",
      asset: "definition",
      poses: [
        { at: 0, x: 0.14, dy: -20 },
        { at: 1, x: 0.14, dy: -20, state: "current" },
        { at: 2, x: 0.14, dy: -20, state: "seen" },
      ],
    },
    {
      id: "context",
      asset: "context",
      from: 2,
      poses: [
        { at: 2, x: 0.45, dy: -20, state: "current" },
        { at: 3, x: 0.45, dy: -20, state: "seen" },
      ],
    },
    {
      id: "tests",
      asset: "tests",
      from: 3,
      poses: [{ at: 3, x: 0.76, dy: -20, state: "current" }],
    },
    {
      id: "lens",
      asset: "lens",
      poses: [
        { at: 0, x: 0.14, dx: 51, dy: -30, compact: { x: 0.14, dx: 36, dy: -30 } },
        { at: 1, x: 0.14, dx: 51, dy: -30, compact: { x: 0.14, dx: 36, dy: -30 } },
        { at: 2, x: 0.45, dx: 51, dy: -30, compact: { x: 0.45, dx: 36, dy: -30 } },
        { at: 3, x: 0.76, dx: 51, dy: -30, compact: { x: 0.76, dx: 36, dy: -30 } },
      ],
    },
  ],
  relations: [
    {
      id: "definition-context",
      source: "definition",
      target: "context",
      label: "Follow calls and imports",
      from: 2,
      activeAt: [2],
      kind: "flow",
      anchors: { source: "right", target: "left" },
      route: "direct",
    },
    {
      id: "context-tests",
      source: "context",
      target: "tests",
      label: "Inspect related tests",
      from: 3,
      activeAt: [3],
      kind: "flow",
      anchors: { source: "right", target: "left" },
      route: "direct",
    },
  ],
} satisfies LessonScene;

/** Fictional findings make each inspection concrete without presenting a live query. */
export const codeFindings = [
  null,
  { source: "definition", file: "policy.ts", detail: "defines authorize()" },
  { source: "context", file: "checkout.ts", detail: "imports & calls it" },
  { source: "tests", file: "policy.test.ts", detail: "checks missing grants" },
] as const;
