import "@fontsource-variable/geist";
import { useEffect, useMemo, useRef, useState } from "react";
import { applyThemeVariant, resolveThemeVariant, type ThemeVariant } from "./theme-mode";
import { EvidenceField } from "./EvidenceField";
import nixosMark from "./pages/platform/assets/technology/nixos.svg";
import { platformNavigation } from "./site-routes";
import { comparisonTopics } from "./pages/comparison/comparison-catalog";
import "./tokens.css";
import "./site-home.css";
import "./site-mobile-fixes.css";
import "./site-polish.css";
import "./site-refinement.css";
import "./immersive.css";
import "./site-atmosphere.css";
import "./theme-surfaces.css";

type NavigationItem = {
  readonly label: string;
  readonly href: string;
  readonly children?: readonly NavigationChild[];
};

type NavigationChild = {
  readonly label: string;
  readonly href: string;
  readonly detail: string;
};

const platformMenuPreviews: Readonly<
  Record<
    string,
    { readonly question: string; readonly stages: readonly string[]; readonly result: string }
  >
> = {
  platform: {
    question: "How does the complete system move?",
    stages: ["Native evidence", "Qualified action", "Searchable receipt"],
    result: "One governed path from knowledge to operation and back.",
  },
  "on-premises": {
    question: "What remains inside your boundary?",
    stages: ["Customer data + identity", "Local policy", "Local runtime"],
    result: "The customer infrastructure remains the operating authority.",
  },
  hybrid: {
    question: "What may cross the boundary?",
    stages: ["Local evidence", "Declared gateway", "Elastic compute", "Receipt return"],
    result: "Capability moves; consequential authority stays local.",
  },
  "managed-cloud": {
    question: "What makes managed operation inspectable?",
    stages: ["Qualified tenant", "Named model + region", "Operation receipt"],
    result: "Evidence remains portable, attributable and usable as an exit path.",
  },
};

const fallbackNavigation: readonly NavigationItem[] = [
  { label: "Platform", href: "/platform", children: platformNavigation },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Comparison", href: "/comparison" },
  { label: "Principles", href: "/principles" },
  { label: "Roadmap", href: "/roadmap" },
];

function projectNavigation(shell: unknown): readonly NavigationItem[] {
  if (!shell || typeof shell !== "object") return fallbackNavigation;
  const site = (shell as { readonly site?: unknown }).site;
  if (!site || typeof site !== "object") return fallbackNavigation;
  const theme = (site as { readonly theme?: unknown }).theme;
  if (!theme || typeof theme !== "object") return fallbackNavigation;
  const config = (theme as { readonly config?: unknown }).config;
  if (!config || typeof config !== "object") return fallbackNavigation;
  const navigation = (config as { readonly navigation?: unknown }).navigation;
  if (!Array.isArray(navigation)) return fallbackNavigation;

  const projected = navigation.flatMap((item): NavigationItem[] => {
    if (!item || typeof item !== "object") return [];
    const label = (item as { readonly label?: unknown }).label;
    const href = (item as { readonly href?: unknown }).href;
    const rawChildren = (item as { readonly children?: unknown }).children;
    const children = Array.isArray(rawChildren)
      ? rawChildren.flatMap((child): NavigationChild[] => {
          if (!child || typeof child !== "object") return [];
          const childLabel = (child as { readonly label?: unknown }).label;
          const childHref = (child as { readonly href?: unknown }).href;
          const detail = (child as { readonly detail?: unknown }).detail;
          return typeof childLabel === "string" &&
            typeof childHref === "string" &&
            typeof detail === "string"
            ? [{ label: childLabel, href: childHref, detail }]
            : [];
        })
      : undefined;
    return typeof label === "string" && typeof href === "string"
      ? [{ label, href, ...(children && children.length > 0 ? { children } : {}) }]
      : [];
  });
  return projected.length > 0 ? projected : fallbackNavigation;
}

function BrandMark() {
  return (
    <a className="tao3k-brand" href="/" aria-label="tao3k home">
      <TaoLogo compact />
      <span className="tao3k-brand__sigil" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="tao3k-brand__name">tao3k</span>
    </a>
  );
}

function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeVariant>(() =>
    typeof document === "undefined" ? "night" : resolveThemeVariant(),
  );

  useEffect(() => {
    const root = document.documentElement;
    const synchronize = () => {
      const value = root.dataset.themeVariant;
      if (value === "night" || value === "paper") setMode(value);
    };
    synchronize();
    const observer = new MutationObserver(synchronize);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme-variant"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next: ThemeVariant = mode === "night" ? "paper" : "night";
    applyThemeVariant(next, true);
    document.querySelector<HTMLButtonElement>(`[data-theme-variant-option='${next}']`)?.click();
    setMode(next);
  };

  return (
    <button
      className={`tao3k-mode-toggle is-${mode}`}
      type="button"
      onClick={toggle}
      aria-label={mode === "night" ? "Switch to paper appearance" : "Switch to night appearance"}
      title={mode === "night" ? "Paper appearance" : "Night appearance"}
    >
      <span className="tao3k-mode-toggle__orb" aria-hidden="true" />
    </button>
  );
}

type MenuGroup = {
  label: string;
  description: string;
  links: readonly { href: string; name: string; detail: string }[];
};

const productGroups: readonly MenuGroup[] = [
  {
    label: "Context",
    description: "Knowledge connected to the work.",
    links: [
      {
        href: "/products/context-system",
        name: "Context System",
        detail: "Direction, not a released integration",
      },
      {
        href: "/products#orgize",
        name: "Orgize",
        detail: "Org parser with a public README",
      },
      {
        href: "/products/lambda-episteme",
        name: "Lambda Episteme",
        detail: "Vertical domain knowledge",
      },
    ],
  },
  {
    label: "Code & engineering",
    description: "Understand and shape engineering work.",
    links: [
      {
        href: "/products/agent-semantic-protocols",
        name: "Agent Semantic Protocols",
        detail: "Source-aware code search",
      },
      {
        href: "/products/lambda-aitia",
        name: "Lambda Aitia",
        detail: "Human + AI software lifecycle",
      },
      {
        href: "/products/deterministic-engineering",
        name: "Deterministic Engineering",
        detail: "Engineering models and methods",
      },
      { href: "/products/lean-poo", name: "LeanPoo", detail: "Composition and proof reuse" },
    ],
  },
  {
    label: "Agent infrastructure",
    description: "Compose and connect agent systems.",
    links: [
      {
        href: "/products/agentic-ai-lab",
        name: "Agentic AI Lab",
        detail: "Strategy control plane, not the runtime",
      },
      {
        href: "/products#marlin-agent-core",
        name: "Marlin Agent Core",
        detail: "Runtime substrate, not a user shell",
      },
      { href: "/products/weaver", name: "Weaver", detail: "Policy-governed gateway" },
      {
        href: "/products/xiuxian-workshop",
        name: "Xiuxian Artisan Workshop",
        detail: "Agent infrastructure workspace",
      },
    ],
  },
  {
    label: "Reasoning & trust",
    description: "Connect facts, rules and decisions.",
    links: [
      {
        href: "/products/meta-relational-reasoning",
        name: "MRR",
        detail: "Relations, rules and admission",
      },
      { href: "/products/mrr-data", name: "MRR Data", detail: "Physical data plane" },
      {
        href: "/products/cedar-poo-spec",
        name: "Cedar POO Spec",
        detail: "Composable authorization",
      },
    ],
  },
];
const solutionGroups: readonly MenuGroup[] = [
  {
    label: "Code & engineering",
    description: "Make complex engineering work understandable.",
    links: [
      {
        href: "/solutions/code-intelligence",
        name: "Agentic code intelligence",
        detail: "Find source, relationships and tests",
      },
      {
        href: "/solutions/engineering-assurance",
        name: "Deterministic engineering",
        detail: "Design, verification and evolution",
      },
    ],
  },
  {
    label: "Agent infrastructure",
    description: "Build and connect governed systems.",
    links: [
      {
        href: "/solutions/composable-agents",
        name: "Composable agent systems",
        detail: "Modules, policy and runtime",
      },
      {
        href: "/solutions/ai-gateway",
        name: "Governed AI gateway",
        detail: "Connect providers and tools",
      },
    ],
  },
  {
    label: "Trust & security",
    description: "Protect systems, data and decisions.",
    links: [
      {
        href: "/solutions/privacy",
        name: "Privacy & data control",
        detail: "Your data, your choice of model",
      },
      {
        href: "/solutions/trust-authorization",
        name: "Trust & authorization",
        detail: "Decisions in context",
      },
      {
        href: "/solutions/security-identity",
        name: "Security",
        detail: "Supply chain, authorization and isolation",
      },
      {
        href: "/solutions/linux-hardening",
        name: "Linux hardening",
        detail: "Kernel and system defenses",
      },
    ],
  },
  {
    label: "Industry solutions",
    description: "Solve challenges in specific domains.",
    links: [
      { href: "/solutions/healthcare", name: "Healthcare", detail: "Identity and disclosure" },
      {
        href: "/solutions/financial-services",
        name: "Financial services",
        detail: "Payment and independent controls",
      },
      {
        href: "/solutions/domain-knowledge",
        name: "Domain knowledge & reasoning",
        detail: "Context, rules and evidence",
      },
    ],
  },
];

const comparisonGroups: readonly MenuGroup[] = [
  "Platform",
  "Context",
  "Agent systems",
  "Code & reasoning",
  "Trust & proof",
].map((category) => ({
  label: category,
  description: "Compare responsibilities and design choices.",
  links: comparisonTopics
    .filter((topic) => topic.category === category)
    .map((topic) => ({ href: `/comparison/${topic.id}`, name: topic.name, detail: topic.focus })),
}));

function ProductsNavigationMenu({
  solutions = false,
  comparisons = false,
  onNavigate,
}: {
  readonly solutions?: boolean;
  readonly comparisons?: boolean;
  readonly onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const groups = comparisons ? comparisonGroups : solutions ? solutionGroups : productGroups;
  const menuName = comparisons ? "Comparison" : solutions ? "Solutions" : "Products";
  const selected = groups[activeIndex] ?? groups[0];
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof globalThis.Node && !rootRef.current?.contains(event.target))
        setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  return (
    <div
      className={`tao3k-products-menu${open ? " is-open" : ""}`}
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "touch" &&
          window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
        )
          setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== "touch" &&
          window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
        )
          setOpen(false);
      }}
    >
      <button
        type="button"
        className="tao3k-products-menu__trigger"
        aria-controls={
          comparisons
            ? "tao3k-comparison-navigation"
            : solutions
              ? "tao3k-solutions-navigation"
              : "tao3k-products-navigation"
        }
        aria-expanded={open}
        onClick={(event) =>
          setOpen((value) =>
            event.detail > 0 && window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
              ? true
              : !value,
          )
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {menuName} <span aria-hidden="true">⌄</span>
      </button>
      <div
        className="tao3k-products-menu__panel tao3k-matrix-menu"
        id={
          comparisons
            ? "tao3k-comparison-navigation"
            : solutions
              ? "tao3k-solutions-navigation"
              : "tao3k-products-navigation"
        }
        aria-hidden={!open}
      >
        <div className="tao3k-matrix-menu__categories">
          <small>
            {comparisons
              ? "EXPLORE COMPARISONS"
              : solutions
                ? "EXPLORE SOLUTIONS"
                : "EXPLORE PRODUCTS"}
          </small>
          <strong>
            {comparisons
              ? "Compare by product."
              : solutions
                ? "Start with the challenge."
                : "Find your building blocks."}
          </strong>
          <div
            aria-label={
              comparisons
                ? "Comparison categories"
                : solutions
                  ? "Solution categories"
                  : "Product categories"
            }
          >
            {groups.map((group, index) => (
              <button
                key={group.label}
                type="button"
                className={activeIndex === index ? "is-active" : undefined}
                aria-pressed={activeIndex === index}
                tabIndex={open ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onPointerEnter={(event) => {
                  if (
                    event.pointerType !== "touch" &&
                    window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
                  )
                    setActiveIndex(index);
                }}
              >
                <span>{group.label}</span>
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
          <a
            className="tao3k-matrix-menu__all"
            href={comparisons ? "/comparison" : solutions ? "/solutions" : "/products"}
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            View all {comparisons ? "comparisons" : solutions ? "solutions" : "products"}{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav
          className="tao3k-matrix-menu__content"
          aria-label={
            comparisons
              ? "Comparison navigation"
              : solutions
                ? "Solutions navigation"
                : "Product navigation"
          }
        >
          <header>
            <small>{selected.label.toUpperCase()}</small>
            <p>{selected.description}</p>
          </header>
          <div className="tao3k-matrix-menu__grid">
            {selected.links.map((link) => (
              <a
                href={link.href}
                key={link.href}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <strong>{link.name}</strong>
                <span>{link.detail}</span>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function PlatformNavigationMenu({ items }: { readonly items: readonly NavigationChild[] }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeItem = items[activeIndex] ?? items[0];
  const activePreviewId = activeItem?.href.split("/").at(-1) ?? "platform";
  const activePreview = platformMenuPreviews[activePreviewId] ?? platformMenuPreviews.platform;

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof globalThis.Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !open) return;
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      className={`tao3k-platform-menu${open ? " is-open" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "touch" &&
          window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
        )
          setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== "touch" &&
          window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
        )
          setOpen(false);
      }}
      ref={rootRef}
    >
      <button
        aria-controls="tao3k-platform-navigation"
        aria-expanded={open}
        className="tao3k-platform-menu__trigger"
        onClick={(event) =>
          setOpen((value) =>
            event.detail > 0 && window.matchMedia("(min-width: 1101px) and (hover: hover)").matches
              ? true
              : !value,
          )
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        type="button"
      >
        Platform <span aria-hidden="true">⌄</span>
      </button>
      <div
        aria-hidden={!open}
        className="tao3k-platform-menu__panel"
        id="tao3k-platform-navigation"
      >
        <div className="tao3k-platform-menu__frame">
          <section className="tao3k-platform-menu__directory">
            <header>
              <small>PLATFORM / DEPLOYMENT SURFACES</small>
              <strong>One qualified system. Choose where its authority lives.</strong>
            </header>
            <nav aria-label="Platform navigation">
              {items.map((item, index) => (
                <a
                  className={activeIndex === index ? "is-active" : undefined}
                  href={item.href}
                  key={item.href}
                  onFocus={() => setActiveIndex(index)}
                  onPointerEnter={() => setActiveIndex(index)}
                  tabIndex={open ? 0 : -1}
                >
                  <span>{String(index).padStart(2, "0")}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </div>
                  <i aria-hidden="true">↗</i>
                </a>
              ))}
            </nav>
          </section>
          {activeItem ? (
            <aside aria-label={`${activeItem.label} preview`} data-deployment={activePreviewId}>
              <div className="tao3k-platform-menu__authority-map">
                <small>{activePreview.question}</small>
                <ol>
                  {activePreview.stages.map((stage, index) => (
                    <li key={stage}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{stage}</strong>
                    </li>
                  ))}
                </ol>
                <p>{activePreview.result}</p>
              </div>
              <small>QUALIFIED DEPLOYMENT</small>
              <strong>{activeItem.label}</strong>
              <p>{activeItem.detail}</p>
            </aside>
          ) : null}
        </div>
        <footer>
          <span>DEPLOYMENT IS AN AUTHORITY MODEL</span>
          <small>Same reproducible core · independently qualified boundary</small>
        </footer>
      </div>
    </div>
  );
}

export function Tao3kSiteHeader({ shell }: { readonly shell?: unknown }) {
  const navigation = useMemo(() => projectNavigation(shell), [shell]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const seen = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -30px 0px" },
    );
    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(
          ".tao3k-home > section:not(:first-child), .tao3k-route-page section:not(:first-child)",
        )
        .forEach((section) => {
          if (seen.has(section)) return;
          seen.add(section);
          if (section.getBoundingClientRect().top > window.innerHeight) {
            section.classList.add("tao3k-reveal");
            observer.observe(section);
          }
        });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return (
    <header className="tao3k-header">
      <BrandMark />
      <nav
        className={`tao3k-header__nav${menuOpen ? " is-open" : ""}`}
        id="site-navigation"
        aria-label="Primary navigation"
      >
        {navigation.map((item) =>
          item.href === "/products" ? (
            <ProductsNavigationMenu
              onNavigate={() => setMenuOpen(false)}
              key={`${item.href}:${item.label}`}
            />
          ) : item.href === "/comparison" ? (
            <ProductsNavigationMenu
              comparisons
              onNavigate={() => setMenuOpen(false)}
              key={`${item.href}:${item.label}`}
            />
          ) : item.href === "/solutions" ? (
            <ProductsNavigationMenu
              solutions
              onNavigate={() => setMenuOpen(false)}
              key={`${item.href}:${item.label}`}
            />
          ) : item.children ? (
            <PlatformNavigationMenu items={item.children} key={`${item.href}:${item.label}`} />
          ) : (
            <a
              href={item.href}
              key={`${item.href}:${item.label}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ),
        )}
      </nav>
      <div className="tao3k-header__actions">
        <ThemeModeToggle />
        <a className="tao3k-header__utility" href="https://github.com/tao3k">
          Open source <span aria-hidden="true">↗</span>
        </a>
        <a className="tao3k-header__cta" href="/platform">
          Explore platform <span aria-hidden="true">↗</span>
        </a>
        <button
          className="tao3k-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /> <span />
        </button>
      </div>
    </header>
  );
}

const systemBoundaries = [
  {
    layer: "PEOPLE FIRST",
    purpose: "Make room for curiosity, creativity and human judgment.",
  },
  {
    layer: "OPEN BY DESIGN",
    purpose: "Open source first, with a fully open product matrix as our goal.",
  },
  {
    layer: "BUILT TO LAST",
    purpose: "Keep people in control of their data and the systems they depend on.",
  },
] as const;

function AdmissibilityStage() {
  return <EvidenceField />;
}

function FoundationVisual({
  kind,
}: {
  readonly kind: "context" | "privacy" | "security" | "infra";
}) {
  return (
    <div className={`foundation-visual foundation-visual--${kind}`} aria-hidden="true">
      <div className="foundation-visual__halo" />
      {kind === "context" ? (
        <>
          <div className="foundation-visual__symbol">
            <svg viewBox="0 0 100 100">
              <path d="M23 16h38l15 15v48H23z M61 16v16h15 M33 44h30 M33 53h24 M33 62h18" />
              <circle cx="66" cy="67" r="14" />
              <path d="M76 77l10 10" />
            </svg>
          </div>
          <div className="foundation-visual__caption">
            THE RIGHT CONTEXT <span>→</span> THE RIGHT QUESTION
          </div>
        </>
      ) : kind === "privacy" ? (
        <>
          <div className="foundation-visual__symbol">
            <svg viewBox="0 0 100 100">
              <path d="M50 12 78 24v23c0 18-12 30-28 39C34 77 22 65 22 47V24z" />
              <rect x="39" y="43" width="22" height="19" rx="3" />
              <path d="M43 43v-7a7 7 0 0 1 14 0v7 M50 51v4" />
            </svg>
          </div>
          <div className="foundation-visual__caption">
            YOUR DATA <span>·</span> YOUR CONTROL
          </div>
        </>
      ) : kind === "security" ? (
        <>
          <div className="foundation-visual__symbol">
            <svg viewBox="0 0 100 100">
              <path d="M50 12 78 24v23c0 18-12 30-28 39C34 77 22 65 22 47V24z M38 49l8 8 17-19" />
              <path d="M15 79h70" />
            </svg>
          </div>
          <div className="foundation-visual__labels">
            <span>CEDAR</span>
            <span>LINUX</span>
            <span>MICROVM</span>
          </div>
        </>
      ) : (
        <>
          <div className="foundation-visual__infra">
            <div className="foundation-visual__code">
              &lt;/&gt;<small>INFRA AS CODE</small>
            </div>
            <span className="foundation-visual__plus">+</span>
            <img src={nixosMark} alt="" loading="lazy" />
            <span className="foundation-visual__plus">=</span>
            <div className="foundation-visual__cube">
              <svg viewBox="0 0 80 80">
                <path d="M40 10 66 24v31L40 70 14 55V24z M14 24l26 15 26-15 M40 39v31" />
              </svg>
              <small>IMMUTABLE</small>
            </div>
          </div>
          <div className="foundation-visual__caption">
            DECLARATIVE <span>·</span> REPRODUCIBLE
          </div>
        </>
      )}
    </div>
  );
}

export function Tao3kSiteHome(_props: { readonly title?: string } = {}) {
  return (
    <main className="tao3k-home">
      <section className="tao3k-home-hero">
        <div className="tao3k-home-hero__copy">
          <p className="tao3k-eyebrow">
            OPEN SOURCE FIRST <span> / </span> AI INFRASTRUCTURE
          </p>
          <h1>
            The deterministic engine
            <span>for AI infrastructure.</span>
          </h1>
          <p className="tao3k-home-hero__lede">
            Open source first. Comprehensive solutions for reliable AI infrastructure and operating
            systems.
          </p>
          <p className="tao3k-home-hero__human">
            For research groups, platform engineers, and teams that need an audit trail from a
            question to an action. The break is that the record, the decision, and proof of what ran
            are still three separate stories.
          </p>
          <div className="tao3k-home-hero__actions">
            <a className="tao3k-button tao3k-button--primary" href="/platform">
              Explore the system <span aria-hidden="true">→</span>
            </a>
            <a className="tao3k-button tao3k-button--quiet" href="/solutions">
              See industry systems
            </a>
          </div>
        </div>
        <AdmissibilityStage />
      </section>

      <section className="tao3k-system-atlas" aria-labelledby="atlas-title">
        <header>
          <p className="tao3k-section-index">ONE LOOP</p>
          <h2 id="atlas-title">From context to action.</h2>
          <p>
            Research leaves a record. A strategy plane says what may run. A runtime substrate
            carries admitted work. Evidence and admission come back to the next question. That is
            one lap, not three products pretending to be one installer.
          </p>
        </header>
        <div className="tao3k-system-atlas__field">
          <div className="tao3k-system-atlas__orbit" aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="tao3k-system-atlas__links">
            <a href="/products/context-system">
              <span>01</span>
              <strong>Research</strong>
              <small>Context System direction. Orgize parses the file.</small>
              <i aria-hidden="true">↗</i>
            </a>
            <a href="/products/agentic-ai-lab">
              <span>02</span>
              <strong>Strategy</strong>
              <small>Agentic AI Lab composes policy. It does not execute.</small>
              <i aria-hidden="true">↗</i>
            </a>
            <a href="/products#marlin-agent-core">
              <span>03</span>
              <strong>Run and return</strong>
              <small>Marlin is the substrate. MRR owns admission.</small>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
        </div>
      </section>

      <section className="tao3k-home-system-boundary" aria-labelledby="system-boundary-title">
        <header>
          <p className="tao3k-section-index">THE IDEA</p>
          <h2 id="system-boundary-title">Build technology around people.</h2>
          <p>
            People bring imagination, judgment and lived experience. We build the open foundations
            that help more people turn those strengths into lasting work.
          </p>
        </header>
        <ol>
          {systemBoundaries.map((item, index) => (
            <li className={index === 2 ? "is-tao3k" : undefined} key={item.layer}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.layer}</strong>
              <p>{item.purpose}</p>
            </li>
          ))}
        </ol>
        <aside>
          <strong>Open to build. Open to question.</strong>
          <p>
            We aim to open our products and security foundations for the community to inspect, audit
            and improve. People and AI can contribute together; people remain accountable for the
            decisions that shape the ecosystem.
          </p>
          <a href="https://github.com/tao3k">Explore the open-source community ↗</a>
        </aside>
      </section>

      <section className="tao3k-foundations" aria-labelledby="foundations-title">
        <header className="tao3k-foundations__intro">
          <p className="tao3k-section-index">BUILT FOR AI-NATIVE WORK</p>
          <h2 id="foundations-title">Your knowledge. Your systems. Your future.</h2>
          <p>
            From everyday context to the infrastructure beneath it, our work starts with the people
            who use it.
          </p>
        </header>
        <div className="tao3k-foundations__list">
          <article>
            <div className="tao3k-foundations__copy">
              <div className="tao3k-foundations__number">
                01 <span>CONTEXT</span>
              </div>
              <h3>The context that matters.</h3>
              <p>Find the knowledge and evidence your work needs.</p>
              <a href="/products/context-system">
                Explore Context System <span aria-hidden="true">↗</span>
              </a>
            </div>
            <FoundationVisual kind="context" />
          </article>
          <article>
            <div className="tao3k-foundations__copy">
              <div className="tao3k-foundations__number">
                02 <span>PRIVACY</span>
              </div>
              <h3>You control your data.</h3>
              <p>Your sources stay yours, even as models change.</p>
              <a href="/solutions/privacy">
                Explore privacy <span aria-hidden="true">↗</span>
              </a>
            </div>
            <FoundationVisual kind="privacy" />
          </article>
          <article>
            <div className="tao3k-foundations__copy">
              <div className="tao3k-foundations__number">
                03 <span>SECURITY</span>
              </div>
              <h3>Security, built in layers.</h3>
              <p>Connect governance, system protection and isolation.</p>
              <a href="/solutions/security-identity">
                Explore security <span aria-hidden="true">↗</span>
              </a>
            </div>
            <FoundationVisual kind="security" />
          </article>
          <article>
            <div className="tao3k-foundations__copy">
              <div className="tao3k-foundations__number">
                04 <span>INFRASTRUCTURE</span>
              </div>
              <h3>Declare it. Reproduce it.</h3>
              <p>Infrastructure as code on an immutable foundation.</p>
              <a href="/platform">
                Explore infrastructure <span aria-hidden="true">↗</span>
              </a>
            </div>
            <FoundationVisual kind="infra" />
          </article>
        </div>
      </section>

      <section className="tao3k-reference" aria-labelledby="home-scenario-title">
        <p className="tao3k-section-index">ONE REFERENCE PATH</p>
        <h2 id="home-scenario-title">Read one path before you imagine a fleet.</h2>
        <p>
          A platform engineer starts from a research note, composes a strategy, and stops at the
          runtime boundary. Solutions records who is involved, which repositories exist, what the
          evidence would be, and which step you can actually reproduce today.
        </p>
        <a href="/solutions#reference-scenario">Follow the reference scenario</a>
      </section>

      <section className="tao3k-start" aria-labelledby="home-start-title">
        <p className="tao3k-section-index">WHAT YOU CAN DO TODAY</p>
        <h2 id="home-start-title">Start from a page or a repository.</h2>
        <ul>
          <li>
            <a href="/platform">Read how deployment ownership is split</a>
          </li>
          <li>
            <a href="/products">Open the product map and its four evidence states</a>
          </li>
          <li>
            <a href="/roadmap">Read the roadmap, including what is still unassigned</a>
          </li>
          <li>
            <a href="https://github.com/tao3k/orgize" rel="noreferrer" target="_blank">
              Read Orgize, a public parser with a README
            </a>
          </li>
          <li>
            <a href="https://github.com/tao3k/tao3k.site" rel="noreferrer" target="_blank">
              Read this site's source
            </a>
          </li>
        </ul>
      </section>

      <section className="tao3k-home-exit">
        <div>
          <p className="tao3k-section-index">EXPLORE THE SYSTEM</p>
          <h2>Explore what open, human-centered AI systems can make possible.</h2>
        </div>
        <a href="/solutions" aria-label="Explore solutions">
          <span>Research → Operations</span>
          <strong aria-hidden="true">↗</strong>
        </a>
      </section>
    </main>
  );
}
import { TaoLogo } from "../../src/components/TaoLogo";
