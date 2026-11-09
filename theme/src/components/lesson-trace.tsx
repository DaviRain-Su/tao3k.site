import type { LessonStage } from "./lesson-scene";
import "./lesson-trace.css";

/** The same declared relationship is visible and available to assistive technology. */
export function LessonTrace({ teaching }: { readonly teaching: LessonStage["teaching"] }) {
  return (
    <div className="lesson-trace" aria-label="Illustrative input, action and result">
      <div>
        <small>INPUT</small>
        <span>{teaching.input}</span>
      </div>
      <b aria-hidden="true">→</b>
      <div>
        <small>ACTION</small>
        <span>{teaching.action}</span>
      </div>
      <b aria-hidden="true">→</b>
      <div>
        <small>RESULT</small>
        <span>{teaching.output}</span>
      </div>
    </div>
  );
}
