import {
  BaseEdge,
  Handle,
  Position,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import type { LessonAnchor, LessonRoute } from "./lesson-scene";
import { lessonRoutePath, lessonRoutePoints } from "./lesson-routing";

const positions: Record<LessonAnchor, Position> = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};
const anchors: LessonAnchor[] = ["left", "right", "top", "bottom"];

/** Invisible ports let a semantic relation attach to the actual object boundary. */
export function LessonPorts() {
  return (
    <>
      {anchors.map((anchor) => (
        <span className="lesson-port" key={anchor}>
          <Handle
            id={`${anchor}-in`}
            type="target"
            position={positions[anchor]}
            isConnectable={false}
          />
          <Handle
            id={`${anchor}-out`}
            type="source"
            position={positions[anchor]}
            isConnectable={false}
          />
        </span>
      ))}
    </>
  );
}

export type TeachingEdge = Edge<
  {
    status: "active" | "blocked" | "settled";
    kind: "flow" | "feedback";
    moving: boolean;
    route?: LessonRoute;
  },
  "teaching"
>;

/** Stable routes keep the evidence lane and return path clear of participants. */
export function TeachingRelation(props: EdgeProps<TeachingEdge>) {
  const [standard] = getSmoothStepPath({ ...props, borderRadius: 10 });
  const { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty, data } = props;
  const path = data?.route
    ? lessonRoutePath(lessonRoutePoints(data.route, { x: sx, y: sy }, { x: tx, y: ty }))
    : standard;
  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={props.markerEnd}
        className={`lesson-relation is-${data?.status ?? "settled"} kind-${data?.kind ?? "flow"}`}
      />
      {data?.status === "active" && data.moving && (
        <circle className="lesson-relation__signal" r="3.5" aria-hidden="true">
          <animateMotion path={path} dur="2.1s" repeatCount="indefinite" />
        </circle>
      )}
    </>
  );
}
