import { StrictMode, useEffect, useState } from "react";
import { createRoot as createReactRoot, type Root } from "react-dom/client";

import { Tao3kThemeHeader, Tao3kThemeHero } from "./index";
import { Tao3kApplicationDocument, Tao3kApplicationHome } from "./site-pages";
import { resolveSiteRoute } from "./site-routes";
import { applyThemeVariant, resolveThemeVariant, type ThemeVariant } from "./theme-mode";

declare global {
  interface Window {
    __tao3kThemePreviewRoot?: Root;
  }
}

const createRoot = (container: Parameters<typeof createReactRoot>[0]): Root => {
  const root = window.__tao3kThemePreviewRoot ?? createReactRoot(container);
  window.__tao3kThemePreviewRoot = root;
  return root;
};

const shell = {
  site: { title: "tao3k.site" },
  staticSite: { sources: [{ id: "home" }, { id: "platform" }, { id: "research" }] },
};

const initialVariant = resolveThemeVariant();
applyThemeVariant(initialVariant, false);

function Preview() {
  const [variant, setVariant] = useState<ThemeVariant>(initialVariant);
  useEffect(() => {
    applyThemeVariant(variant, false);
  }, [variant]);
  const requestedId = window.location.pathname.replace(/^\/+|\/+$/gu, "");
  const route = requestedId ? resolveSiteRoute(requestedId) : null;

  return (
    <div className="tao3k-zhixing-preview theme-surface--tao3k-site">
      <div className="theme-variant-navigation">
        {(["night", "paper"] as const).map((option) => (
          <button
            key={option}
            data-theme-variant-option={option}
            aria-pressed={variant === option}
            onClick={() => {
              applyThemeVariant(option, true);
              setVariant(option);
            }}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <Tao3kThemeHeader shell={shell} />
      {requestedId ? (
        <Tao3kApplicationDocument requestedId={requestedId} route={route} shell={shell} />
      ) : (
        <>
          <Tao3kThemeHero />
          <Tao3kApplicationHome shell={shell} />
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
