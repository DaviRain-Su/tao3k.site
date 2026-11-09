/** Pure, serializable scene descriptions. Asset keys are resolved by the renderer. */
export type LessonPose = {
  readonly at: number;
  readonly x: number;
  readonly dx?: number;
  readonly dy: number;
  readonly state?: string;
  readonly compact?: { readonly x: number; readonly dx?: number; readonly dy: number };
};
export type LessonActor = {
  readonly id: string;
  readonly asset: string;
  readonly from?: number;
  readonly poses: readonly LessonPose[];
};
export type LessonStage = {
  readonly description: string;
  readonly flags?: readonly string[];
  readonly teaching: {
    readonly input: string;
    readonly action: string;
    readonly output: string;
    readonly actors: readonly string[];
  };
};
export type LessonAnchor = "left" | "right" | "top" | "bottom";
export type LessonRoute =
  | "direct"
  | "approach"
  | "side"
  | "return"
  | "stack"
  | "around"
  | "around-top";
export type LessonRelation = {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label: string;
  readonly from: number;
  readonly activeAt: readonly number[];
  readonly kind: "flow" | "feedback";
  readonly blockedFrom?: number;
  readonly anchors: { readonly source: LessonAnchor; readonly target: LessonAnchor };
  readonly compactAnchors?: { readonly source: LessonAnchor; readonly target: LessonAnchor };
  readonly route?: LessonRoute;
  readonly compactRoute?: LessonRoute;
};
export type LessonScene = {
  readonly stages: readonly LessonStage[];
  readonly actors: readonly LessonActor[];
  readonly compactBelow?: number;
  readonly relations?: readonly LessonRelation[];
  readonly assets?: Readonly<Record<string, { readonly src: string; readonly alt: string }>>;
};
export type ResolvedLessonActor = {
  readonly id: string;
  readonly asset: string;
  readonly state: string;
  readonly media?: { readonly src: string; readonly alt: string };
  readonly x: number;
  readonly y: number;
};

/** Validate authoring intent before a scene is used by a renderer. */
export function defineLessonScene(scene: LessonScene): LessonScene {
  if (!scene.stages.length) throw new Error("A lesson needs at least one stage");
  if (
    scene.compactBelow !== undefined &&
    (!Number.isFinite(scene.compactBelow) || scene.compactBelow <= 0)
  )
    throw new Error("Invalid compact breakpoint");
  const actors = new Map(scene.actors.map((actor) => [actor.id, actor]));
  if (actors.size !== scene.actors.length) throw new Error("Duplicate lesson actor");
  for (const [index, stage] of scene.stages.entries()) {
    const { teaching } = stage;
    if (
      typeof stage.description !== "string" ||
      !stage.description.trim() ||
      !teaching ||
      typeof teaching.input !== "string" ||
      !teaching.input.trim() ||
      typeof teaching.action !== "string" ||
      !teaching.action.trim() ||
      typeof teaching.output !== "string" ||
      !teaching.output.trim() ||
      !Array.isArray(teaching.actors) ||
      !teaching.actors.length
    )
      throw new Error(`Stage ${index} requires input, action, output and visible actors`);
    for (const id of teaching.actors) {
      const actor = actors.get(id);
      if (!actor || (actor.from ?? 0) > index || !actor.poses.some((pose) => pose.at <= index))
        throw new Error(`Stage ${index} refers to unavailable actor ${id}`);
    }
  }
  for (const actor of scene.actors) {
    if (!actor.poses.length || !actor.poses.some((pose) => pose.at === (actor.from ?? 0)))
      throw new Error(`Actor ${actor.id} needs a pose at its first stage`);
    if (
      actor.poses.some(
        (pose) =>
          !Number.isInteger(pose.at) ||
          pose.at < 0 ||
          pose.at >= scene.stages.length ||
          !Number.isFinite(pose.x) ||
          !Number.isFinite(pose.dy) ||
          !Number.isFinite(pose.dx ?? 0) ||
          (pose.compact !== undefined &&
            (!Number.isFinite(pose.compact.x) ||
              !Number.isFinite(pose.compact.dy) ||
              !Number.isFinite(pose.compact.dx ?? 0))),
      )
    )
      throw new Error(`Actor ${actor.id} has an invalid pose`);
  }
  const relations = scene.relations ?? [];
  if (new Set(relations.map((item) => item.id)).size !== relations.length)
    throw new Error("Duplicate lesson relation");
  for (const relation of relations) {
    const source = actors.get(relation.source);
    const target = actors.get(relation.target);
    if (
      !source ||
      !target ||
      source.id === target.id ||
      !relation.label.trim() ||
      !Number.isInteger(relation.from) ||
      relation.from < 0 ||
      relation.from >= scene.stages.length ||
      (source.from ?? 0) > relation.from ||
      (target.from ?? 0) > relation.from
    )
      throw new Error(`Invalid lesson relation ${relation.id}`);
    if (
      relation.activeAt.some(
        (stage) =>
          !Number.isInteger(stage) || stage < relation.from || stage >= scene.stages.length,
      ) ||
      (relation.blockedFrom !== undefined &&
        (!Number.isInteger(relation.blockedFrom) ||
          relation.blockedFrom < relation.from ||
          relation.blockedFrom >= scene.stages.length))
    )
      throw new Error(`Invalid timing for lesson relation ${relation.id}`);
  }
  return scene;
}

/** Resolve a beat deterministically; no DOM, React, or playback clock is involved. */
export function resolveLessonFrame(
  scene: LessonScene,
  stage: number,
  width: number,
  baseline: number,
) {
  if (!Number.isInteger(stage) || stage < 0 || stage >= scene.stages.length)
    throw new RangeError(`Invalid lesson stage: ${stage}`);
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(baseline))
    throw new RangeError("Invalid lesson viewport");
  const compact = width < (scene.compactBelow ?? 480);
  const actors: ResolvedLessonActor[] = [];
  for (const actor of scene.actors) {
    if (stage < (actor.from ?? 0)) continue;
    const pose = actor.poses.reduce<LessonPose | undefined>(
      (current, item) => (item.at <= stage && (!current || item.at > current.at) ? item : current),
      undefined,
    );
    if (!pose) throw new Error(`Missing initial pose for ${actor.id}`);
    const position = compact && pose.compact ? pose.compact : pose;
    actors.push({
      id: actor.id,
      asset: actor.asset,
      media: scene.assets?.[actor.asset],
      state: pose.state ?? "default",
      x: width * position.x + (position.dx ?? 0),
      y: baseline + position.dy,
    });
  }
  const relations = (scene.relations ?? [])
    .filter((relation) => stage >= relation.from)
    .map((relation) => ({
      ...relation,
      anchors: compact && relation.compactAnchors ? relation.compactAnchors : relation.anchors,
      route: compact ? (relation.compactRoute ?? relation.route) : relation.route,
      status:
        relation.blockedFrom !== undefined && stage >= relation.blockedFrom
          ? ("blocked" as const)
          : relation.activeAt.includes(stage)
            ? ("active" as const)
            : ("settled" as const),
    }));
  return { ...scene.stages[stage], actors, relations };
}
