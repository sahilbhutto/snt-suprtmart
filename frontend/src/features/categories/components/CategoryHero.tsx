import { Link } from "react-router-dom";
import { LuTruck } from "react-icons/lu";
import CategoryImage from "./CategoryImage";
import Badge from "../../../components/ui/Badge";
import { cn } from "../../../lib/cn";
import { formatCount, formatPrice } from "../../../lib/format";
import type { CategoryListItem } from "../types/categories.types";
import type { CategoryProductsState } from "../hooks/useCategoryProducts";

interface CategoryHeroProps {
  category: CategoryListItem;
  f: CategoryProductsState;
}

const CategoryHero = ({ category, f }: CategoryHeroProps) => {
  const quick = [
    { label: "On sale", active: f.sale, onClick: f.toggleSale },
    { label: "In stock", active: f.stock, onClick: f.toggleStock },
    { label: "Top rated", active: f.rating >= 4, onClick: () => f.setRating(f.rating >= 4 ? 0 : 4) },
    { label: "Under Rs. 500", active: f.max === 500, onClick: () => f.setPrice(f.min, f.max === 500 ? null : 500) },
  ];

  const stats = [
    { value: formatCount(category.productCount), label: "products" },
    { value: formatPrice(f.bounds.min), label: "starting from" },
    { value: "2 hrs", label: "delivery" },
  ];

  return (
    <section aria-labelledby="category-title">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink p-5 text-ink-foreground ring-1 ring-ink-border sm:rounded-[2.25rem] sm:p-8 lg:p-12">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 size-96 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-5">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <Link to="/" className="transition hover:text-ink-foreground">Home</Link>
              <span aria-hidden>/</span>
              <Link to="/categories" className="transition hover:text-ink-foreground">All categories</Link>
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-ink-foreground">{category.name}</span>
            </nav>

            <div className="flex items-center gap-4">
              <CategoryImage category={category} className="size-16 shrink-0 rounded-2xl sm:size-20 lg:hidden" />
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="glass" className="gap-1.5 py-1.5 text-xs">
                    <LuTruck size={14} /> Delivered in 2 hours
                  </Badge>
                  {category.isNew && <Badge tone="accent">New</Badge>}
                  {category.hasDeals && <Badge tone="deal">Deals</Badge>}
                  {(category.trend7d ?? 0) >= 10 && <Badge tone="glass">Trending +{category.trend7d}%</Badge>}
                </div>
                <h1 id="category-title" className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {category.name}
                </h1>
              </div>
            </div>

            <p className="max-w-xl text-base text-ink-muted sm:text-lg">
              Shop {category.name.toLowerCase()} online. Fresh stock, honest prices, cash on delivery or online payment.
            </p>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Quick filters">
              {quick.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  aria-pressed={q.active}
                  onClick={q.onClick}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[13px] font-bold transition",
                    q.active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-ink-border text-ink-foreground hover:bg-white/10",
                  )}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-border pt-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="text-2xl font-extrabold tracking-tight tabular-nums">{s.value}</dd>
                  <dt className="text-xs text-ink-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Large image, desktop only */}
          <div className="relative hidden justify-self-end lg:block">
            <CategoryImage category={category} className="w-full max-w-xs rounded-[2rem] shadow-pop ring-1 ring-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
