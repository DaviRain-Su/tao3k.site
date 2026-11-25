import type { ProductRecord } from "./product-catalog";

function ExternalLink({ href, children }: { readonly href: string; readonly children: string }) {
  return (
    <a href={href} rel="noreferrer" target="_blank">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ProductFacts({ product }: { readonly product: ProductRecord }) {
  return (
    <div className="product-facts">
      <p className="product-card__state">{product.maturity}</p>
      <p>{product.responsibility}</p>
      <p>{product.maturityNote}</p>
      <dl className="product-card__meta">
        <div>
          <dt>Get it</dt>
          <dd>{product.access}</dd>
        </div>
        <div>
          <dt>Docs</dt>
          <dd>
            {product.docsHref ? (
              <ExternalLink href={product.docsHref}>{product.docsLabel}</ExternalLink>
            ) : (
              product.docsLabel
            )}
          </dd>
        </div>
        <div>
          <dt>Upstream</dt>
          <dd>{product.upstream}</dd>
        </div>
        <div>
          <dt>Downstream</dt>
          <dd>{product.downstream}</dd>
        </div>
      </dl>
      <div className="product-card__links">
        {product.detailHref ? <a href={product.detailHref}>Project page</a> : null}
        {product.repository ? (
          <ExternalLink href={product.repository}>Repository</ExternalLink>
        ) : null}
      </div>
    </div>
  );
}
