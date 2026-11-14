import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { LuPackageCheck, LuTruck, LuUndo2 } from "react-icons/lu";
import ProductReviews from "./ProductReviews";
import type { ProductListItem } from "../types/products.types";
import type { ProductReview, ReviewSummary } from "../../../types/review.types";
import { formatCount } from "../../../lib/format";
import { cn } from "../../../lib/cn";

export type ProductTabKey = "description" | "details" | "reviews" | "delivery";

interface ProductTabsProps {
  product: ProductListItem;
  reviews: ProductReview[];
  summary: ReviewSummary;
  active: ProductTabKey;
  onChange: (tab: ProductTabKey) => void;
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:gap-4">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-semibold">{children}</dd>
  </div>
);

const ProductTabs = ({ product, reviews, summary, active, onChange }: ProductTabsProps) => {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabs: { key: ProductTabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "details", label: "Details" },
    { key: "reviews", label: `Reviews (${formatCount(summary.count)})` },
    { key: "delivery", label: "Delivery and returns" },
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.key === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    onChange(tabs[next].key);
    refs.current[tabs[next].key]?.focus();
  };

  const description =
    product.description ??
    `Buy ${product.name} (${product.unit}) online from SNT Supermart. ${product.brand.name} quality, checked before dispatch and delivered in 2 hours.`;

  return (
    <section id="product-tabs" aria-label="Product information" className="scroll-mt-24 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-8">
      <div
        role="tablist"
        aria-label="Product information"
        onKeyDown={handleKeyDown}
        className="-mx-5 flex gap-1 overflow-x-auto border-b border-border px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t) => {
          const selected = t.key === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[t.key] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`panel-${t.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(t.key)}
              className={cn(
                "shrink-0 border-b-[3px] px-4 py-3.5 text-sm font-bold transition",
                selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="pt-6">
        {active === "description" && (
          <div className="grid max-w-3xl gap-4">
            <p className="leading-relaxed text-muted-foreground">{description}</p>
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center gap-2"><LuPackageCheck className="text-link" /> Pack size: {product.unit}</li>
              <li className="flex items-center gap-2"><LuTruck className="text-link" /> Delivered in 2 hours</li>
              <li className="flex items-center gap-2"><LuUndo2 className="text-link" /> Report any issue within 24 hours</li>
            </ul>
          </div>
        )}

        {active === "details" && (
          <dl className="max-w-3xl">
            <Row label="Brand">
              <Link to={`/products?brand=${product.brand.slug}`} className="text-link hover:underline">{product.brand.name}</Link>
            </Row>
            <Row label="Category">
              <Link to={`/category/${product.category.slug}`} className="text-link hover:underline">{product.category.name}</Link>
            </Row>
            <Row label="Pack size">{product.unit}</Row>
            {product.sku && <Row label="SKU">{product.sku}</Row>}
            {product.barcode && <Row label="Barcode">{product.barcode}</Row>}
            <Row label="Availability">{product.inStock ? `${product.stockQuantity} units in stock` : "Out of stock"}</Row>
            {product.maxPerOrder && <Row label="Order limit">{product.maxPerOrder} per order</Row>}
          </dl>
        )}

        {active === "reviews" && <ProductReviews reviews={reviews} summary={summary} />}

        {active === "delivery" && (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: LuTruck, title: "Delivery", text: "Most orders arrive within 2 hours. Choose a delivery slot at checkout." },
              { icon: LuPackageCheck, title: "Packaging", text: "Items are checked and packed before dispatch. Cold items stay cold." },
              { icon: LuUndo2, title: "Returns", text: "Damaged, wrong or missing items? Report within 24 hours for a refund or replacement." },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="grid gap-2 rounded-2xl border border-border bg-background p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-link"><Icon size={18} /></span>
                  <b>{c.title}</b>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTabs;
