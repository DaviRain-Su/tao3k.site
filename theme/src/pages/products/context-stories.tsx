import { useEffect, useRef, useState } from "react";
import "./context-stories.css";

type StoryStep = { readonly label: string; readonly title: string; readonly detail: string };
function useStoryClock<T extends HTMLElement = HTMLElement>(
  count: number,
  interval = 3900,
  loop = true,
) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || reduced || (!loop && step === count - 1)) return;
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % count), interval);
    return () => window.clearTimeout(timer);
  }, [count, interval, loop, reduced, step, visible]);
  return { ref, step, setStep, reduced, moving: visible && !reduced };
}
const dataSteps: readonly StoryStep[] = [
  {
    label: "Source",
    title: "A record that carries its context",
    detail:
      "A single Org record can hold the plan, its status, evidence and recovery instructions.",
  },
  {
    label: "Structure",
    title: "Read the structure, keep the source",
    detail:
      "Properties, headings and evidence can be projected for targeted queries while the original stays readable.",
  },
  {
    label: "HTML",
    title: "A page for readers",
    detail:
      "Export the record as a navigable HTML document using an appropriate Org export toolchain.",
  },
  {
    label: "Slides",
    title: "A presentation for discussion",
    detail: "Reframe the same source as a slide deck using a compatible exporter.",
  },
  {
    label: "Markdown",
    title: "A portable handoff",
    detail: "Produce Markdown for a repository, review or another publishing system.",
  },
];
const architecturePhases = ["File", "Metadata", "Context"] as const;
export function ContextArchitectureStory() {
  const { ref, step, setStep, reduced, moving } = useStoryClock(
    architecturePhases.length,
    3000,
    false,
  );
  return (
    <section
      className="context-story context-architecture"
      ref={ref}
      data-stage={step}
      data-moving={moving}
      aria-labelledby="context-architecture-title"
    >
      <header className="context-story__header">
        <p>THE CHALLENGE / AI WORK</p>
        <h2 id="context-architecture-title">Context changes with the work.</h2>
        <span>
          Conversations and notes change every turn. Copying every edit into a database or squeezing
          it all into one prompt can make context harder to keep current.
        </span>
      </header>
      <div className="context-architecture__problem">
        <span>SCATTERED SOURCES</span>
        <i>→</i>
        <span>CONSTANT CHANGE</span>
        <i>→</i>
        <span>CONTEXT LOST BETWEEN TASKS</span>
      </div>
      <div className="context-architecture__solution">
        <small>OUR APPROACH</small>
        <strong>Keep the record. Compose the context.</strong>
      </div>
      <div className="context-architecture__scene">
        <div className="context-architecture__lane context-architecture__source">
          <small>01 / FILE AS DATA</small>
          <h3>Write naturally.</h3>
          <div className="context-architecture__file-head">
            <span>ORG SOURCE</span>
            <b>work.org</b>
          </div>
          <pre>
            {"* Review\n  :PROPERTIES:\n  :CASE_ID: case-A\n  :STATUS: open\n  :END:\n  "}
            <span key={step === 0 ? "before" : "updated"}>
              {step === 0 ? "The check is awaiting evidence." : "The latest check needs review."}
            </span>
          </pre>
          <p>{step === 0 ? "An evolving source record." : "The note changes in the source."}</p>
        </div>
        <div
          className={`context-architecture__lane context-architecture__metadata ${step >= 1 ? "is-visible" : ""}`}
        >
          <small>02 / METADATA FOR QUERY</small>
          <h3>Find precisely.</h3>
          <div className="context-architecture__keys">
            <span>
              CASE_ID <b>case-A</b>
            </span>
            <span>
              STATUS <b>open</b>
            </span>
            <span>
              SECTION <b>Review</b>
            </span>
          </div>
          <p>Org Elements selects structure from the source.</p>
        </div>
        <div
          className={`context-architecture__lane context-architecture__working ${step >= 2 ? "is-visible" : ""}`}
        >
          <small>03 / CONTEXT ENGINE</small>
          <h3>Compose for the task.</h3>
          <div className="context-architecture__result">
            <span>WORKING CONTEXT</span>
            <strong>The latest check needs review.</strong>
            <small>Source: work.org / Review</small>
          </div>
          <p>The engine composes a working view while the source stays intact.</p>
        </div>
      </div>
      {reduced && (
        <nav
          className="context-architecture__controls"
          aria-label="Architecture illustration stages"
        >
          {architecturePhases.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={index === step}
              onClick={() => setStep(index)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
      <p className="context-story__caption">
        Illustrative composition, not a live query. An index or database can serve selected
        structured data; it need not replace the original files. Working context remains bounded by
        the model's input window.
      </p>
    </section>
  );
}
const scienceSteps: readonly StoryStep[] = [
  {
    label: "Question",
    title: "Begin with the question",
    detail: "Keep the research question, data reference and method in the same context.",
  },
  {
    label: "Compute",
    title: "Connect a runtime",
    detail:
      "Org Babel works with language runtimes; community integrations also connect Jupyter kernels.",
  },
  {
    label: "Inspect",
    title: "Examine the result",
    detail: "Keep the output beside the method that produced it, ready for review.",
  },
  {
    label: "Share",
    title: "Tell the complete story",
    detail: "Bring the narrative, code and result into a report or presentation.",
  },
];
function StepBar({
  steps,
  step,
  onStep,
}: {
  readonly steps: readonly StoryStep[];
  readonly step: number;
  readonly onStep: (step: number) => void;
}) {
  return (
    <nav className="context-story__steps" aria-label="Illustration stages">
      {steps.map((item, index) => (
        <button
          key={item.label}
          type="button"
          aria-pressed={index === step}
          onClick={() => onStep(index)}
        >
          <span>0{index + 1}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
function OutputPreview({ step }: { readonly step: number }) {
  if (step === 0)
    return (
      <div className="org-preview__structure">
        <span className="org-preview__eyebrow">STRUCTURED RECORD</span>
        <h3>Plan, evidence, recovery.</h3>
        <p>One source retains the context behind the work.</p>
        <div className="org-preview__tree">
          <span>
            ▾ Plan <i>DONE</i>
          </span>
          <span>├ Properties &amp; scope</span>
          <span>├ Evidence &amp; validation</span>
          <span>└ Recovery &amp; handoff</span>
        </div>
      </div>
    );
  if (step === 1)
    return (
      <div className="org-preview__structure">
        <span className="org-preview__eyebrow">SELECTED VIEW · ILLUSTRATIVE</span>
        <h3>Find what matters.</h3>
        <div className="org-preview__table">
          <div>
            <span>STATUS</span>
            <span>EVIDENCE</span>
            <span>NEXT</span>
          </div>
          <div>
            <strong>Done</strong>
            <strong>3 checks</strong>
            <strong>Handoff</strong>
          </div>
        </div>
        <p>A query or index is a derived view, not a replacement for the record.</p>
      </div>
    );
  if (step === 2)
    return (
      <div className="org-preview__page">
        <div className="org-preview__pagebar">
          <span>●</span>
          <span>●</span>
          <span>●</span>
          <small>research / plan</small>
        </div>
        <article>
          <small>PROJECT NOTES</small>
          <h3>Experiment plan</h3>
          <p>Evidence and decisions, in context.</p>
          <h4>Validation</h4>
          <div className="org-preview__rule" />
          <div className="org-preview__rule short" />
          <span>View evidence →</span>
        </article>
      </div>
    );
  if (step === 3)
    return (
      <div className="org-preview__slide">
        <div>
          <small>01 / RESEARCH</small>
          <h3>
            From question
            <br />
            to evidence.
          </h3>
          <p>Experiment plan · review</p>
        </div>
        <span>01 — 04</span>
      </div>
    );
  return (
    <div className="org-preview__markdown">
      <div>
        <span>README.md</span>
        <small>MARKDOWN</small>
      </div>
      <pre>
        {
          "# Experiment plan\n\n## Evidence\n- Reproducible checks\n- Results reviewed\n\n## Next\nHandoff the findings."
        }
      </pre>
    </div>
  );
}
export function ContextDataStory() {
  const { ref, step, setStep, moving } = useStoryClock(dataSteps.length);
  return (
    <section
      className="context-story org-atelier"
      ref={ref}
      data-moving={moving}
      aria-labelledby="context-data-story"
    >
      <header className="context-story__header">
        <p>01 / FILE AS DATA</p>
        <h2 id="context-data-story">One record. Many expressions.</h2>
        <span>Capture the work once. Carry its meaning wherever it needs to go.</span>
      </header>
      <div className="org-atelier__stage">
        <div className="org-atelier__source">
          <div className="org-atelier__bar">
            <div>
              <span className="org-atelier__file-icon">◈</span>
              <strong>agent-plan.org</strong>
            </div>
            <small>YOUR SOURCE</small>
          </div>
          <div className="org-atelier__editor">
            <span className="is-heading">
              * DONE Experiment plan <b>[3/3] :agent:plan:</b>
            </span>
            <span className="is-property">:PROPERTIES:</span>
            <span className="is-property"> :ID: experiment-plan</span>
            <span className="is-property"> :STATUS: done</span>
            <span className="is-property"> :CAPTURE_SOURCE: conversation</span>
            <span className="is-property">:END:</span>
            <span> </span>
            <span className="is-heading">** Scope &amp; checkpoints</span>
            <span> - [X] Capture context</span>
            <span> - [X] Run focused checks</span>
            <span> - [X] Review evidence</span>
            <span className="is-heading">** Evidence</span>
            <span> | Claim | Evidence | Result |</span>
            <span> | Plan | Checks | passed |</span>
            <span className="is-heading">** Recovery</span>
            <span> #+begin_src text</span>
            <span> next-action: handoff</span>
            <span> #+end_src</span>
          </div>
          <div className="org-atelier__sourcefoot">STRUCTURE · CHECKLISTS · EVIDENCE · CODE</div>
        </div>
        <div className="org-atelier__output">
          <div className="org-atelier__output-head">
            <div>
              <span>DERIVED VIEWS</span>
              <strong>{step < 2 ? "Understand the record" : "Publish for the audience"}</strong>
            </div>
            <small>ILLUSTRATIVE</small>
          </div>
          <div className="org-atelier__formats" aria-label="Illustrative output formats">
            {(["HTML", "Slides", "Markdown"] as const).map((format, index) => (
              <button
                key={format}
                type="button"
                aria-pressed={step === index + 2}
                onClick={() => setStep(index + 2)}
              >
                {format}
              </button>
            ))}
          </div>
          <div className="org-atelier__preview" key={step}>
            <OutputPreview step={step} />
          </div>
          <div className="org-atelier__explain">
            <strong>{dataSteps[step].title}</strong>
            <p>{dataSteps[step].detail}</p>
          </div>
        </div>
      </div>
      <StepBar steps={dataSteps} step={step} onStep={setStep} />
      <p className="context-story__caption">
        Org brings structure, properties and executable blocks into the working record. Markdown
        remains a useful publication format; a selective index or database can serve queryable data.
      </p>
      <p className="context-story__caption">
        Adapted from the structure of a{" "}
        <a href="https://gist.githubusercontent.com/GTrunSec/075cf55f24da9b7389ab5d62c8cbed6d/raw/e160be275c329278927abe1534b312cbb5afb061/agent-plan-019efaef-50cf-77c3-b880-f23fa2c6950d-1782446907065831000.org">
          real Org plan
        </a>
        ; the views are illustrations, not a live export. Formats depend on the configured
        toolchain.
      </p>
    </section>
  );
}
export function ContextScienceStory() {
  const { ref, step, setStep, moving } = useStoryClock(scienceSteps.length);
  return (
    <section
      className="context-story science-lab"
      ref={ref}
      data-moving={moving}
      aria-labelledby="context-science-story"
    >
      <header className="context-story__header">
        <p>03 / AI FOR SCIENCE</p>
        <h2 id="context-science-story">A living research notebook.</h2>
        <span>Keep the question, computation and evidence in the same evolving context.</span>
      </header>
      <div className="science-lab__bench">
        <div className="science-lab__paper">
          <div className="science-lab__paper-top">
            <span>RESEARCH NOTEBOOK</span>
            <strong>experiment.org</strong>
          </div>
          <div className={`science-lab__question ${step === 0 ? "is-active" : ""}`}>
            <small>01 / QUESTION</small>
            <h3>What changes the result?</h3>
            <p>Compare an experiment across two conditions.</p>
          </div>
          <div className={`science-lab__code ${step === 1 ? "is-active" : ""}`}>
            <small>02 / METHOD · ORG BABEL</small>
            <pre>{"#+begin_src python\n  result = analyze(data)\n  plot(result)\n#+end_src"}</pre>
          </div>
          <div className="science-lab__source-foot">Narrative + data + code remain together</div>
        </div>
        <div className="science-lab__workspace">
          <div className={`science-lab__runtime ${step === 1 ? "is-active" : ""}`}>
            <div>
              <small>COMPUTATION</small>
              <strong>Choose a runtime</strong>
            </div>
            <div className="science-lab__kernels">
              <span>Python</span>
              <span>R</span>
              <span>
                Custom <i>direction</i>
              </span>
            </div>
          </div>
          <div className={`science-lab__result ${step >= 2 ? "is-active" : ""}`}>
            <div className="science-lab__result-head">
              <div>
                <small>03 / RESULT · ILLUSTRATIVE</small>
                <strong>{step === 3 ? "Ready to share" : "A result in context"}</strong>
              </div>
              <span>↗</span>
            </div>
            <figure className="science-lab__chart">
              <figcaption className="science-lab__chart-caption">
                Illustrative comparison of two experiment conditions
              </figcaption>
              <div>
                <span style={{ height: "44%" }} />
                <small>Condition A</small>
              </div>
              <div>
                <span style={{ height: "72%" }} />
                <small>Condition B</small>
              </div>
            </figure>
            <div className="science-lab__result-foot">Method + result + interpretation</div>
          </div>
        </div>
      </div>
      <div className="science-lab__narration" key={step}>
        <span>0{step + 1}</span>
        <strong>{scienceSteps[step].title}</strong>
        <p>{scienceSteps[step].detail}</p>
      </div>
      <StepBar steps={scienceSteps} step={step} onStep={setStep} />
      <p className="context-story__caption">
        An Org-first authoring direction alongside tools such as Quarto. This conceptual example
        does not execute code or claim feature parity; custom kernels and our orchestration remain a
        design direction. Org Babel and community Jupyter integrations are separate tools.
      </p>
    </section>
  );
}

const agentPlanPhases = ["Request", "Understand", "Rules", "Plan", "Execute", "Reflect"] as const;
export function ContextStructureStory() {
  const { ref, step, setStep, reduced, moving } = useStoryClock<HTMLElement>(
    agentPlanPhases.length,
    3000,
    true,
  );
  return (
    <section
      className="context-story context-engine"
      ref={ref}
      data-moving={moving}
      aria-labelledby="context-structure-story"
    >
      <header className="context-story__header">
        <p>02 / AN AGENT'S WORKING RECORD</p>
        <h2 id="context-structure-story">From a request to an explainable record.</h2>
        <span>Follow the agent from intent and adaptable rules to a record of the work.</span>
      </header>
      <div className="agent-workbench" data-stage={step} data-moving={moving}>
        <div className="agent-workbench__bar">
          <span>
            <i /> AGENT WORKSPACE
          </span>
          <span>ILLUSTRATIVE PLAYBACK</span>
        </div>
        <div className="agent-workbench__columns">
          <div className="agent-workbench__request">
            <div className="agent-workbench__heading">
              <span>{step === 0 ? "01 / REQUEST" : "01 / AGENT WORKSPACE"}</span>
              <b>{step === 0 ? "YOU" : "LLM + CONTRACT + ASCENT"}</b>
            </div>
            {step === 0 ? (
              <div className="workbench-appear" key="request">
                <h3>What would you like to do?</h3>
                <div className="agent-workbench__prompt" aria-label="Example request">
                  <span>
                    Integrate the build, run the tests, and tell me what still needs attention.
                  </span>
                  <div>
                    <small>Example request</small>
                    <span aria-hidden="true">↑</span>
                  </div>
                </div>
                <div className="agent-workbench__context">
                  <span>ATTACHED CONTEXT</span>
                  <strong>⌁ &nbsp; Build workspace</strong>
                  <strong>§ &nbsp; Org contract library</strong>
                </div>
              </div>
            ) : (
              <div className="workbench-appear" key="activity">
                <div className="workbench-intent">
                  <small>YOUR REQUEST</small>
                  <span>Integrate the build, verify tests, report what remains.</span>
                </div>
                <div className="workbench-action">
                  <span className="agent-workbench__marker">✳</span>
                  <div>
                    <small>LLM · UNDERSTAND</small>
                    <strong>Inspect → integrate → test → report</strong>
                    <p>Turn the request into a task and identify the checks it needs.</p>
                  </div>
                </div>
                <div className="workbench-action">
                  <span className="agent-workbench__marker">§</span>
                  <div>
                    <small>ORG CONTRACT · ANCHOR</small>
                    <strong>agent.plan.v1</strong>
                    <p>Select and adapt relevant constraints for this task.</p>
                  </div>
                </div>
                {step >= 2 && (
                  <div className="workbench-rule workbench-appear">
                    <div>
                      <span>GERBIL ASCENT · SCHEME</span>
                      <small>EXAMPLE RULE</small>
                    </div>
                    <pre>
                      {
                        "(ascent\n  (relation verify (task) '((build)))\n  (relation needs-evidence (task))\n  ((needs-evidence task) <--\n    (verify task)))"
                      }
                    </pre>
                    <p>For a task requiring verification, derive the need for evidence.</p>
                  </div>
                )}
                {step >= 4 && (
                  <div className="workbench-action workbench-appear">
                    <span className="agent-workbench__marker">›_</span>
                    <div>
                      <small>EXECUTION · EXAMPLE</small>
                      <strong>Run the focused build test</strong>
                      <p>Record its command and result alongside the task.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="agent-workbench__thinking workbench-trace">
            <div className="agent-workbench__heading">
              <span>02 / TRACE STATION</span>
              <b>RAW ORG</b>
            </div>
            <div className="workbench-filehead">
              <div>
                <h3>agent-tasks.org</h3>
                <p>A source record that grows with the work.</p>
              </div>
              <span>{step >= 3 ? "● ACTIVE" : "○ PREPARING"}</span>
            </div>
            <div
              className="agent-workbench__record workbench-raw"
              aria-label="Illustrative raw Org task record"
            >
              {step < 3 ? (
                <div className="agent-workbench__waiting">
                  The task record appears after the agent prepares its rules.
                </div>
              ) : (
                <>
                  <div>
                    <span>* TODO</span> Build and verify <em>[{step >= 4 ? "3/4" : "0/4"}]</em>{" "}
                    :agent:plan:
                  </div>
                  <div>:PROPERTIES:</div>
                  <div>&nbsp; :ID: build-integration</div>
                  <div>&nbsp; :CONTRACT_ORG: agent.plan.v1</div>
                  <div>&nbsp; :STATUS: active</div>
                  <div>:END:</div>
                  <div>** Context</div>
                  <div>&nbsp; Integrate the build and verify the tests.</div>
                  {step >= 3 && (
                    <>
                      <div className="workbench-line-new">** Checkpoints</div>
                      <div>&nbsp; - [{step >= 4 ? "X" : " "}] Inspect the build</div>
                      <div>&nbsp; - [{step >= 4 ? "X" : " "}] Integrate the changes</div>
                      <div>&nbsp; - [{step >= 4 ? "X" : " "}] Run focused tests</div>
                    </>
                  )}
                  {step >= 4 && (
                    <>
                      <div className="workbench-line-new">** Evidence</div>
                      <div>&nbsp; - Command :: gxi build.ss test</div>
                      <div>&nbsp; - Result :: passed (example)</div>
                    </>
                  )}
                  {step >= 5 && (
                    <>
                      <div className="workbench-line-new">** Reflection</div>
                      <div>&nbsp; - Tests passed; integration review remains.</div>
                      <div>** Recovery</div>
                      <div>&nbsp; - Next action :: review integration</div>
                    </>
                  )}
                </>
              )}
            </div>
            {step >= 4 && (
              <div className="agent-workbench__lineage" aria-label="Example evidence relationships">
                <span>Claim</span>
                <i>→</i>
                <span>Command</span>
                <i>→</i>
                <span>Result</span>
                <i>→</i>
                <span>Reflection</span>
              </div>
            )}
          </div>
        </div>
        {reduced && (
          <nav className="agent-plan__controls" aria-label="Illustration stages">
            {agentPlanPhases.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={index === step}
                onClick={() => setStep(index)}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}

const industrySteps: readonly StoryStep[] = [
  {
    label: "Guide",
    title: "Give the agent a contract",
    detail: "The plan must include an Evidence section with at least one link.",
  },
  {
    label: "Draft",
    title: "Generate a first draft",
    detail: "The agent writes the plan, but the evidence link is missing.",
  },
  {
    label: "Check",
    title: "Find what is missing",
    detail: "Org Elements selects the Evidence section and the contract checks its links.",
  },
  {
    label: "Repair",
    title: "Add evidence and check again",
    detail: "The example adds a source link; the same structural check can now pass.",
  },
];
export function ContextIndustryStory() {
  return (
    <section className="context-story context-domain" aria-labelledby="context-domain-story">
      <header className="context-story__header">
        <p>04 / DOMAIN KNOWLEDGE</p>
        <h2 id="context-domain-story">Turn a care question into usable context.</h2>
        <span>
          Select structured facts, retain the surrounding notes, and connect their sources into
          context an agent can inspect.
        </span>
      </header>
      <HealthcareContextLesson />
      <ContextContractLesson />
    </section>
  );
}
const healthcarePhases = ["Question", "Readings", "Trajectory", "Query", "Context"] as const;
const careFiles = [
  {
    name: "2026-03-10.org",
    label: "10 Mar · current",
    raw: '#+TITLE: Follow-up visit\n* Blood pressure check\n  :PROPERTIES:\n  :CASE_ID: case-A\n  :BP_SYS: 142\n  :BP_DIA: 90\n  :BP_UNIT: mmHg\n  :END:\n** Visit conversation\n   Patient: "I feel dizzy when I stand."\n   The clinician noted the patient was\n   alert during the visit. The medication\n   list has not yet been reconciled.',
  },
  {
    name: "2026-03-03.org",
    label: "03 Mar · follow-up",
    raw: "#+TITLE: Follow-up visit\n* Blood pressure check\n  :PROPERTIES:\n  :CASE_ID: case-A\n  :BP_SYS: 148\n  :BP_DIA: 92\n  :BP_UNIT: mmHg\n  :END:\n** Visit conversation\n   The patient recalls feeling lightheaded\n   after taking a medicine, but cannot\n   recall its name. The timing and cause\n   have not been established.",
  },
  {
    name: "2026-02-18.org",
    label: "18 Feb · earlier",
    raw: "#+TITLE: Follow-up visit\n* Blood pressure check\n  :PROPERTIES:\n  :CASE_ID: case-A\n  :BP_SYS: 136\n  :BP_DIA: 88\n  :BP_UNIT: mmHg\n  :END:\n** Visit conversation\n   The patient reports occasional past\n   palpitations; no further details were\n   recorded. They recall a childhood rash\n   after penicillin, but its severity and\n   circumstances are not documented.",
  },
] as const;
function HealthcareContextLesson() {
  const { ref, step, setStep, reduced, moving } = useStoryClock<HTMLDivElement>(
    healthcarePhases.length,
    3200,
    false,
  );
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const sourcePreview = useRef<HTMLDivElement>(null);
  const activeFile =
    selectedFile !== null && selectedFile < careFiles.length ? selectedFile : [0, 0, 2, 1, 0][step];
  const inspectSource = (index: number) => {
    setSelectedFile(index);
    if (window.matchMedia("(max-width: 700px)").matches) {
      sourcePreview.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };
  return (
    <div className="care-story" ref={ref} data-stage={step} data-moving={moving}>
      <div className="care-story__question">
        <span aria-hidden="true">⌕</span>
        <div>
          <small>CLINICIAN'S QUESTION</small>
          <strong>What history and reactions are relevant to today's reading?</strong>
        </div>
        <small>SYNTHETIC EXAMPLE</small>
      </div>
      <div className="care-record">
        <div className="care-record__raw">
          <div className="care-story__label">
            <span>ORG SOURCES · SAME CASE</span>
            <span>3 VISIT FILES</span>
          </div>
          <nav className="care-files" aria-label="Illustrative Org records">
            {careFiles.map((file, index) => (
              <button
                type="button"
                key={file.name}
                aria-pressed={activeFile === index}
                onClick={() => setSelectedFile(index)}
              >
                <span>{file.label}</span>
                <small>{file.name}</small>
              </button>
            ))}
          </nav>
          <div className="care-file-preview" ref={sourcePreview}>
            <div className="care-file-preview__title">
              <span>RAW ORG</span>
              <strong>{careFiles[activeFile].name}</strong>
            </div>
            <pre>{careFiles[activeFile].raw}</pre>
          </div>
          <p>
            Each source keeps searchable properties, the clinician's note and its original location
            together.
          </p>
        </div>
        <div className="care-record__output">
          <div className="care-story__label">
            <span>RETRIEVAL · WORKING CONTEXT</span>
            <span>ILLUSTRATIVE</span>
          </div>
          <div className="care-record__stage" key={step}>
            {step === 0 ? (
              <div className="care-record__waiting">
                <span>⌕</span>
                <p>The answer is distributed across visits and history.</p>
              </div>
            ) : step === 1 ? (
              <>
                <small>ORG ELEMENTS · SELECT STRUCTURED FACTS</small>
                <h3>Find the properties in each source</h3>
                <pre>
                  {
                    '(org-elements node-property\n  (any-of (property key "CASE_ID")\n          (property key "BP_SYS")\n          (property key "BP_DIA"))\n  (descendant-of scope))'
                  }
                </pre>
                <div className="care-record__excerpt">
                  “I feel dizzy when I stand.” <b>[3]</b>
                </div>
                <p>
                  The property query selects Element nodes within a source. The surrounding visit
                  note keeps the patient's words.
                </p>
              </>
            ) : step === 2 ? (
              <>
                <small>CONTENT GRAPH · PROPOSED SOURCE LINEAGE</small>
                <h3>Connect the same case across visits</h3>
                <div className="care-trajectory">
                  <div>
                    <span>18 FEB</span>
                    <strong>136/88</strong>
                    <small>2026-02-18.org</small>
                  </div>
                  <i />
                  <div>
                    <span>03 MAR</span>
                    <strong>148/92</strong>
                    <small>2026-03-03.org</small>
                  </div>
                  <i />
                  <div>
                    <span>10 MAR</span>
                    <strong>142/90</strong>
                    <small>2026-03-10.org</small>
                  </div>
                </div>
                <div className="care-record__mapping">
                  Each visit binds a case, its recorded values, its narrative and its source.
                </div>
              </>
            ) : step === 3 ? (
              <>
                <small>GQL · PROPOSED CROSS-FILE GRAPH</small>
                <h3>Build a query from the domain model</h3>
                <pre>
                  {"MATCH (c:Case)-[:HAS_VISIT]->(v:Visit)\nWHERE c.id = 'case-A'\nRETURN c, v"}
                </pre>
                <p>
                  Design sketch: an admitted case identity connects visits; Org supplies their
                  original content.
                </p>
              </>
            ) : (
              <>
                <small>CONTEXT FOR THE CLINICIAN / AGENT</small>
                <h3>Three visits, with their sources</h3>
                <div className="care-evidence-list">
                  <button type="button" onClick={() => inspectSource(2)}>
                    <b>[1] 18 Feb · 136/88</b>
                    <span>Past palpitations; childhood rash after penicillin.</span>
                    <small>2026-02-18.org ↗</small>
                  </button>
                  <button type="button" onClick={() => inspectSource(1)}>
                    <b>[2] 03 Mar · 148/92</b>
                    <span>Lightheaded after an unnamed medicine; cause unknown.</span>
                    <small>2026-03-03.org ↗</small>
                  </button>
                  <button type="button" onClick={() => inspectSource(0)}>
                    <b>[3] 10 Mar · 142/90</b>
                    <span>“I feel dizzy when I stand.” Medication list not yet reconciled.</span>
                    <small>2026-03-10.org ↗</small>
                  </button>
                </div>
                <p>Select a source to inspect the original note.</p>
              </>
            )}
          </div>
        </div>
      </div>
      {reduced && (
        <nav className="care-story__accessible" aria-label="Example stages">
          {healthcarePhases.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={step === index}
              onClick={() => setStep(index)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
      <p className="care-story__caption">
        Synthetic records and illustrative retrieval; not real patient data or a live execution. The
        cross-file graph and generated GQL are a design sketch. The existing{" "}
        <a href="https://github.com/tao3k/mrr-data/blob/main/docs/architecture/healthcare-query-audit.org">
          MRR healthcare query
        </a>{" "}
        covers scenario, case and profile relations. A reported reaction does not establish
        causation.
      </p>
    </div>
  );
}
function ContextContractLesson() {
  const { ref, step, setStep, moving } = useStoryClock<HTMLDivElement>(industrySteps.length);
  return (
    <div ref={ref} className="contract-lesson__section">
      <div className="contract-lesson__intro">
        <small>ORG CONTRACT · AGENTIC WORK</small>
        <h3>Give the agent explicit requirements.</h3>
      </div>
      <div className="contract-lesson" data-stage={step} data-moving={moving}>
        <div className="contract-lesson__brief">
          <div>
            <small>EXAMPLE · CARE REVIEW PLAN</small>
            <strong>Prepare a plan with a link to supporting evidence.</strong>
          </div>
          <span>ILLUSTRATION · NO PATIENT DATA</span>
        </div>
        <div className="contract-lesson__workbench">
          <div className="contract-lesson__rules">
            <div className="contract-lesson__heading">
              <div>
                <small>01 / ORG CONTRACT</small>
                <strong>What the plan must contain</strong>
              </div>
              <span>SCHEME</span>
            </div>
            <div className="contract-lesson__requirement">
              <span>§</span>
              <div>
                <strong>Evidence section</strong>
                <p>At least one link beneath the section.</p>
              </div>
            </div>
            <pre>
              {
                '(assert-org-element "section.has-evidence-link" error\n  (bindings\n    (bind evidence\n      (org-elements headline\n        (property source-title "Evidence")\n        (child-of scope))))\n  (org-elements link (descendant-of evidence))\n  (expect at-least 1))'
              }
            </pre>
            <div className="contract-lesson__hint">
              <b>Org Elements</b> selects the section and its links. <b>Org Contract</b> checks the
              requirement.
            </div>
          </div>
          <div className="contract-lesson__arrow" aria-hidden="true">
            <span>→</span>
            <i />
          </div>
          <div className="contract-lesson__draft">
            <div className="contract-lesson__heading">
              <div>
                <small>02 / AGENT'S ORG DRAFT</small>
                <strong>care-review.org</strong>
              </div>
              <span>EXAMPLE</span>
            </div>
            <div className="contract-lesson__document">
              <div>* Care review plan</div>
              <div>** Review</div>
              <div>&nbsp;&nbsp; Check the applicable care profile.</div>
              <div>** Evidence</div>
              <div className={`contract-lesson__evidence ${step >= 3 ? "is-ready" : ""}`}>
                {step >= 3 ? "   [[id:profile-3][Care profile]]" : "   …"}
              </div>
            </div>
            <div
              className={`contract-lesson__feedback ${step >= 2 ? "is-visible" : ""} ${step >= 3 ? "is-pass" : ""}`}
            >
              <span>{step >= 3 ? "✓" : "!"}</span>
              <div>
                <strong>{step >= 3 ? "Evidence link found" : "Evidence link missing"}</strong>
                <small>
                  {step >= 3 ? "Structural requirement satisfied" : "Add a link under Evidence"}
                </small>
              </div>
            </div>
            {step < 2 && (
              <p className="contract-lesson__waiting">
                {step === 0 ? "The contract guides the work." : "The draft is ready to check."}
              </p>
            )}
          </div>
        </div>
        <div className="contract-lesson__narration" key={step}>
          <span>0{step + 1}</span>
          <div>
            <strong>{industrySteps[step].title}</strong>
            <p>{industrySteps[step].detail}</p>
          </div>
        </div>
        <StepBar steps={industrySteps} step={step} onStep={setStep} />
        <details className="contract-lesson__domain">
          <summary>Where does domain context come from?</summary>
          <p>
            A separate healthcare GQL example connects a scenario to a case and its applicable
            profile. Such a query can supply domain context to an agent; it does not itself run this
            contract.
          </p>
          <pre>
            {
              "MATCH (s:Scenario)-[:HAS_CASE]->(c:Case)\n  -[:HAS_EFFECTIVE_PROFILE]->(p:Profile)\nWHERE s.identity = 'healthcare'\nRETURN s.identity, c.id, p.identity"
            }
          </pre>
          <a href="https://github.com/tao3k/mrr-data/blob/main/docs/architecture/healthcare-query-audit.org">
            View the healthcare query ↗
          </a>
        </details>
      </div>
      <p className="context-story__caption">
        Working context and contracts have distinct roles: a contract defines checks; actual
        permissions and runtime controls determine who may edit it or other policy material. The
        contract is adapted from{" "}
        <a href="https://github.com/tao3k/orgize/blob/8b0959a85d21207e377ee99647df0750abadd9f1/languages/org/modules/org-contract/contracts.org">
          Orgize's evidence-link fixture
        </a>
        . Draft, feedback and repair are illustrative, not a live model or contract execution. A
        passing structural check does not establish that the evidence is correct; complete
        GQL-to-agent integration is a design direction.
      </p>
    </div>
  );
}
