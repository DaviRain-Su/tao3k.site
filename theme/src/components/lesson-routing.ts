import type { LessonRoute } from "./lesson-scene";

export type LessonPoint = { readonly x: number; readonly y: number };

/** Orthogonal routes are pure so a scene can test its path against its objects. */
export function lessonRoutePoints(
  route: LessonRoute,
  source: LessonPoint,
  target: LessonPoint,
): readonly LessonPoint[] {
  const { x: sx, y: sy } = source;
  const { x: tx, y: ty } = target;
  if (route === "direct") return [source, target];
  if (route === "approach") return [source, { x: sx, y: ty - 8 }, { x: tx, y: ty - 8 }, target];
  if (route === "stack")
    return [source, { x: sx, y: (sy + ty) / 2 }, { x: tx, y: (sy + ty) / 2 }, target];
  if (route === "side") return [source, { x: sx - 12, y: sy }, { x: sx - 12, y: ty }, target];
  if (route === "return") return [source, { x: sx, y: ty + 20 }, { x: tx, y: ty + 20 }, target];
  const gutter = 4;
  if (route === "around-top")
    return [
      source,
      { x: sx, y: sy + 20 },
      { x: gutter, y: sy + 20 },
      { x: gutter, y: ty - 14 },
      { x: tx, y: ty - 14 },
      target,
    ];
  return [
    source,
    { x: sx, y: sy + 20 },
    { x: gutter, y: sy + 20 },
    { x: gutter, y: ty + 20 },
    { x: tx, y: ty + 20 },
    target,
  ];
}

export function lessonRoutePath(points: readonly LessonPoint[]): string {
  return points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
}
