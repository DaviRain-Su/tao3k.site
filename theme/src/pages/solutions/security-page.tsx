import nixosMark from "../platform/assets/technology/nixos.svg";
import "./privacy-page.css";

function SecurityLayers() {
  const layers = [
    {
      n: "01",
      icon: "policy",
      title: "Authorization",
      name: "Cedar",
      detail: "Decide which identity may take which action, in context.",
      href: "/products/cedar-poo-spec",
    },
    {
      n: "02",
      icon: "system",
      title: "System protection",
      name: "Linux",
      detail: "Use operating-system controls to restrict access and capabilities.",
      href: "/solutions/linux-hardening",
    },
    {
      n: "03",
      icon: "isolation",
      title: "Isolation",
      name: "MicroVM",
      detail: "Separate workloads with a lightweight virtual machine boundary.",
      href: "/platform/on-premises",
    },
  ];
  return (
    <div className="privacy-layers">
      {layers.map((layer) => (
        <a key={layer.n} href={layer.href}>
          <span className="privacy-layers__number">{layer.n}</span>
          <span className="privacy-layers__icon" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {layer.icon === "policy" ? (
                <>
                  <path d="M16 3l10 4v8c0 6-4 10-10 14C10 25 6 21 6 15V7z" />
                  <path d="m11 16 3 3 7-7" />
                </>
              ) : layer.icon === "system" ? (
                <>
                  <rect x="5" y="6" width="22" height="20" rx="3" />
                  <path d="M10 12h12 M10 17h8 M10 22h5" />
                </>
              ) : (
                <>
                  <path d="m16 3 11 6v13l-11 7L5 22V9z M5 9l11 7 11-7 M16 16v13" />
                </>
              )}
            </svg>
          </span>
          <div>
            <small>{layer.name}</small>
            <h3>{layer.title}</h3>
            <p>{layer.detail}</p>
          </div>
          <b aria-hidden="true">↗</b>
        </a>
      ))}
    </div>
  );
}

export function SecurityPage() {
  return (
    <div className="privacy-page security-page">
      <section className="privacy-hero">
        <div>
          <p className="privacy-kicker">SOLUTIONS / SECURITY</p>
          <h1>
            Build systems
            <br />
            <em>you can trust.</em>
          </h1>
          <p>
            Protect the software supply chain, govern access and isolate workloads with defense in
            depth.
          </p>
          <a href="#security-supply-title">
            Explore the layers <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="privacy-hero__mark" aria-hidden="true">
          <svg viewBox="0 0 180 180">
            <path d="M90 21 143 43v42c0 34-22 57-53 74C59 142 37 119 37 85V43z M70 91l14 14 29-32" />
          </svg>
        </div>
      </section>
      <section className="privacy-section privacy-supply" aria-labelledby="security-supply-title">
        <div className="privacy-section__intro">
          <p className="privacy-kicker">01 / OPEN SUPPLY CHAIN</p>
          <h2 id="security-supply-title">Declare once. Build with confidence.</h2>
          <p>
            Describe infrastructure and dependencies as code. Nix and NixOS help make system builds
            inspectable and deployment repeatable.
          </p>
          <a href="/platform">
            Explore infrastructure <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div
          className="supply-story"
          aria-label="Illustration of a declared system built with Nix and distributed as a closure"
        >
          <div className="supply-story__head">
            <span>FROM SOURCE TO SYSTEM</span>
            <small>ILLUSTRATIVE</small>
          </div>
          <div className="supply-story__steps">
            <div className="supply-story__step">
              <span className="supply-story__icon supply-story__code" aria-hidden="true">
                &lt;/&gt;
              </span>
              <div>
                <small>01 / DECLARE</small>
                <strong>Code &amp; dependencies</strong>
                <p>Versioned inputs</p>
              </div>
            </div>
            <div className="supply-story__connector" aria-hidden="true">
              <i />
            </div>
            <div className="supply-story__step">
              <span className="supply-story__icon">
                <img src={nixosMark} alt="" />
              </span>
              <div>
                <small>02 / BUILD</small>
                <strong>Nix system closure</strong>
                <p>Inspect the dependency graph</p>
              </div>
            </div>
            <div className="supply-story__connector" aria-hidden="true">
              <i />
            </div>
            <div className="supply-story__step">
              <span className="supply-story__icon supply-story__package" aria-hidden="true">
                ⬡
              </span>
              <div>
                <small>03 / DISTRIBUTE</small>
                <strong>Deploy the closure</strong>
                <p>Reuse cached artifacts when available</p>
              </div>
            </div>
          </div>
          <div className="supply-story__note">
            Immutable system generations help keep deployments consistent. Cache reuse can reduce
            repeated build and transfer work.
          </div>
        </div>
      </section>
      <section className="privacy-section privacy-security">
        <div className="privacy-section__intro">
          <p className="privacy-kicker">02 / SECURITY BY LAYER</p>
          <h2>Control needs boundaries.</h2>
          <p>
            Authorization, system protection and isolation work at different layers of a private AI
            environment.
          </p>
        </div>
        <div>
          <SecurityLayers />
          <p className="privacy-security__note">
            Illustrative architecture: exact enforcement and available controls depend on the
            deployment. Cedar policy decisions need a trusted enforcement point; Linux controls and
            MicroVM isolation must be configured and verified for the workload.
          </p>
        </div>
      </section>
      <section className="privacy-next">
        <div>
          <p className="privacy-kicker">OPEN SOURCE / AUTHORIZATION</p>
          <h2>See policy in practice.</h2>
        </div>
        <a href="https://github.com/hardenedlinux/cedar-poo-spec/blob/main/Examples/Scenarios/README.org">
          Explore the Cedar scenario <span aria-hidden="true">↗</span>
        </a>
        <a className="privacy-next__related" href="/solutions/privacy">
          Explore privacy <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
