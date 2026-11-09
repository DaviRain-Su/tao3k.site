import { useEffect, useRef, useState } from "react";
import nixLogo from "./assets/technology/nixos.svg";
import "./cloud-workspace.css";

const stages = [
  {
    step: "01",
    title: "Open",
    detail: "Bring your project",
    tool: "Git · workspace",
    line: "Open your project in a cloud workspace.",
    code: "project + configuration",
    output: "A workspace for your project",
  },
  {
    step: "02",
    title: "Develop",
    detail: "Tools & services",
    tool: "Flox · devenv",
    line: "Describe development tools and services.",
    code: "tools + services + AI",
    output: "A declared development environment",
  },
  {
    step: "03",
    title: "Build",
    detail: "Pinned dependencies",
    tool: "Nix · Nixpkgs",
    line: "Build from pinned inputs and dependencies.",
    code: "inputs → Nix closure",
    output: "An inspectable build artifact",
  },
  {
    step: "04",
    title: "Deploy",
    detail: "Provision & deliver",
    tool: "OpenTofu · Colmena",
    line: "Provision resources and deliver the system.",
    code: "resources + system rollout",
    output: "Cloud resources and deployment target",
  },
] as const;

function WorkspaceJourney() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || !auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % stages.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, [visible, auto]);
  const stage = stages[active];
  return (
    <div ref={root} className="workspace-journey">
      <div className="cloud-workspace__visual">
        <div className="cloud-workspace__bar">
          <span>
            <i /> CLOUD WORKSPACE
          </span>
          <span>ILLUSTRATIVE JOURNEY</span>
        </div>
        <div className="cloud-workspace__screen">
          <div key={`editor-${active}`} className="cloud-workspace__editor">
            <div>
              <i />
              <i />
              <i />
            </div>
            <span>YOUR PROJECT</span>
            <strong>{stage.tool}</strong>
            <code>{stage.code}</code>
          </div>
          <div className="cloud-workspace__nix">
            <img src={nixLogo} alt="Nix logo" />
            <strong>Nix foundation</strong>
            <small>DECLARED INPUTS</small>
          </div>
          <div key={`target-${active}`} className="cloud-workspace__target">
            <span>
              {stage.step} / {stage.title.toUpperCase()}
            </span>
            <strong>{stage.output}</strong>
            <small>{stage.line}</small>
          </div>
        </div>
      </div>
      <ol className="cloud-workspace__steps">
        {stages.map((item, index) => (
          <li key={item.step}>
            <button
              type="button"
              aria-pressed={index === active}
              onClick={() => {
                setAuto(false);
                setActive(index);
              }}
            >
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CloudWorkspace() {
  return (
    <>
      <section className="cloud-workspace" aria-labelledby="cloud-workspace-title">
        <div className="cloud-workspace__intro">
          <p className="tao3k-route-kicker">A CLOUD WORKSPACE / DESIGN DIRECTION</p>
          <h2 id="cloud-workspace-title">
            Your workspace.
            <br />
            Wherever you are.
          </h2>
          <p>
            Open a development environment in the cloud, work with your tools and AI, then carry the
            same declared system toward deployment.
          </p>
        </div>
        <WorkspaceJourney />
      </section>
      <section className="cloud-foundation" aria-labelledby="cloud-foundation-title">
        <div>
          <p className="tao3k-route-kicker">WHY NIX</p>
          <h2 id="cloud-foundation-title">An environment you can describe—and rebuild.</h2>
          <p>
            Nix brings packages, dependencies and system definitions into a shared declarative
            foundation. Pinned inputs help teams reconstruct an environment and inspect what went
            into it.
          </p>
          <a href="/comparison/infrastructure">Explore the infrastructure landscape ↗</a>
        </div>
        <div className="cloud-foundation__tools">
          <div>
            <span>ENVIRONMENTS</span>
            <strong>Flox · devenv</strong>
            <small>Development tools &amp; services</small>
          </div>
          <div>
            <span>COMPOSITION</span>
            <strong>Scheme · Nix</strong>
            <small>Configuration &amp; system identity</small>
          </div>
          <div>
            <span>PROVISION &amp; OPERATE</span>
            <strong>OpenTofu · Pulumi · Ansible</strong>
            <small>Resources &amp; automation</small>
          </div>
          <div>
            <span>REALIZE &amp; DEPLOY</span>
            <strong>NixOS · Colmena</strong>
            <small>Systems &amp; fleet delivery</small>
          </div>
        </div>
        <p className="cloud-foundation__note">
          Nix-based composition and selected OpenTofu preparation are documented in the project. The
          integrated cloud workspace and other tool combinations are a direction; reproducibility
          depends on the inputs, platform and deployment actually tested.
        </p>
      </section>
      <section className="cloud-trust" aria-label="Privacy and security in the cloud">
        <div>
          <span>01 / PRIVACY</span>
          <h3>Your data stays yours.</h3>
          <p>Choose where source data lives and which context is shared with a model.</p>
          <a href="/solutions/privacy">Explore privacy ↗</a>
        </div>
        <div>
          <span>02 / SECURITY</span>
          <h3>Designed to be inspected.</h3>
          <p>
            Open security components and models for community review, with explicit isolation and
            authorization boundaries.
          </p>
          <a href="/solutions/security-identity">Explore security ↗</a>
        </div>
      </section>
    </>
  );
}
