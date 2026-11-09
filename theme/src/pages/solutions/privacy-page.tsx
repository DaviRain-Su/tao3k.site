import { useEffect, useRef, useState } from "react";
import "./privacy-page.css";

const models = ["Model A", "Model B", "Local model"] as const;

function OwnershipScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [automatic, setAutomatic] = useState(true);
  useEffect(() => {
    const element = sceneRef.current;
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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!visible || !automatic || media.matches) return;
    const timer = window.setInterval(
      () => setSelected((value) => (value + 1) % models.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, [automatic, visible]);
  return (
    <div
      ref={sceneRef}
      className="privacy-scene"
      aria-label="Illustration of source files and interchangeable models"
    >
      <div className="privacy-scene__heading">
        <span>YOUR ENVIRONMENT</span>
        <small>INTERACTIVE ILLUSTRATION</small>
      </div>
      <div className="privacy-scene__body">
        <div className="privacy-source">
          <span className="privacy-source__icon" aria-hidden="true">
            ▤
          </span>
          <div>
            <small>YOUR SOURCE</small>
            <strong>Knowledge &amp; files</strong>
            <span>Org · Git · your storage</span>
          </div>
          <b aria-hidden="true">⌂</b>
        </div>
        <div className="privacy-connection" aria-hidden="true">
          <span />
          <i>SELECTED CONTEXT</i>
          <span />
        </div>
        <div className="privacy-model">
          <small>YOUR CHOICE</small>
          <strong>{models[selected]}</strong>
          <span>Receives the context you choose</span>
        </div>
      </div>
      <div className="privacy-scene__footer">
        <span>SWITCH MODEL</span>
        <div>
          {models.map((model, index) => (
            <button
              type="button"
              key={model}
              aria-pressed={index === selected}
              onClick={() => {
                setSelected(index);
                setAutomatic(false);
              }}
            >
              {model}
            </button>
          ))}
        </div>
      </div>
      <p className="privacy-scene__note">
        Switching the model does not require moving the source record. Context sent to a provider is
        subject to that provider’s terms.
      </p>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="privacy-page">
      <section className="privacy-hero">
        <div>
          <p className="privacy-kicker">SOLUTIONS / PRIVACY</p>
          <h1>
            Your data.
            <br />
            <em>Your choice.</em>
          </h1>
          <p>
            Keep your knowledge in a place you control. Bring the right context to the model that
            fits your work.
          </p>
          <a href="#how-it-works">
            See how it works <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="privacy-hero__mark" aria-hidden="true">
          <svg viewBox="0 0 180 180">
            <path d="M90 21 143 43v42c0 34-22 57-53 74C59 142 37 119 37 85V43z" />
            <rect x="70" y="78" width="40" height="34" rx="5" />
            <path d="M77 78V65a13 13 0 0 1 26 0v13 M90 91v8" />
          </svg>
        </div>
      </section>
      <section className="privacy-section" id="how-it-works">
        <div className="privacy-section__intro">
          <p className="privacy-kicker">01 / DATA OWNERSHIP</p>
          <h2>
            Keep the source.
            <br />
            Change the model.
          </h2>
          <p>
            Your files remain the source of record. A task can use selected context with a different
            model while the original stays where you keep it.
          </p>
        </div>
        <OwnershipScene />
      </section>
      <section className="privacy-principles">
        <div>
          <span>01</span>
          <h3>Your source</h3>
          <p>Keep knowledge in readable, portable files.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Your boundary</h3>
          <p>Choose where data is stored and which context is shared.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Your model</h3>
          <p>Use the model and deployment that suit the task.</p>
        </div>
      </section>
      <section className="privacy-next">
        <div>
          <p className="privacy-kicker">EXPLORE THE SYSTEM</p>
          <h2>Choose where your AI runs.</h2>
        </div>
        <a href="/platform/on-premises">
          Explore on-premises deployment <span aria-hidden="true">↗</span>
        </a>
        <a className="privacy-next__related" href="/solutions/security-identity">
          Explore security <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
