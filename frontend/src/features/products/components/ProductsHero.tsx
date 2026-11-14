import { Link } from "react-router-dom";
import { LuSearch, LuTruck, LuX } from "react-icons/lu";
import { categoryItems, productItems } from "../../../data/catalog.selectors";
import { formatCount } from "../../../lib/format";
import Badge from "../../../components/ui/Badge";
import ProductImage from "./ProductImage";
import { cn } from "../../../lib/cn";

interface ProductsHeroProps {
  q: string;
  onQueryChange: (value: string) => void;
}

const quickSearches = ["Basmati rice", "Fresh milk", "Cooking oil", "Eggs", "Tea"];

/* Static class names so Tailwind finds them */
const mosaicStyle = [
  "-rotate-3",
  "translate-y-6 rotate-2",
  "rotate-3",
  "-translate-y-2 rotate-2",
  "translate-y-4 -rotate-2",
  "-rotate-3",
];

const ProductsHero = ({ q, onQueryChange }: ProductsHeroProps) => {
  // Featured products first, then the rest
  const mosaic = [...productItems.filter((p) => p.isFeatured), ...productItems.filter((p) => !p.isFeatured)].slice(0, 6);

  const stats = [
    { value: formatCount(productItems.length), label: "products" },
    { value: formatCount(categoryItems.length), label: "categories" },
    { value: "2 hrs", label: "delivery" },
  ];

  return (
    <section aria-labelledby="products-title">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-ink-foreground ring-1 ring-ink-border sm:rounded-[2.25rem] sm:p-10 lg:p-14">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 size-96 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-muted">
              <Link to="/" className="transition hover:text-ink-foreground">Home</Link>
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-ink-foreground">All products</span>
            </nav>

            <Badge tone="glass" className="w-max gap-2 py-1.5 text-xs">
              <LuTruck size={14} /> Delivered in 2 hours
            </Badge>

            <h1 id="products-title" className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              All{" "}
              <span className="relative inline-block text-accent">
                products
                <svg aria-hidden viewBox="0 0 200 9" fill="none" className="absolute -bottom-1.5 left-0 w-full">
                  <path d="M2 6.5C50 2 120 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="max-w-xl text-base text-ink-muted sm:text-lg">
              Search, filter and sort everything in our store. Fresh stock, clear prices, cash on delivery or online payment.
            </p>

            <form role="search" onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-xl items-center gap-1 rounded-full bg-white p-1.5 shadow-pop">
              <LuSearch className="ms-3 shrink-0 text-neutral-500" aria-hidden />
              <input
                value={q}
                onChange={(e) => onQueryChange(e.target.value)}
                aria-label="Search products"
                placeholder="Search rice, milk, oil, eggs..."
                className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => onQueryChange("")}
                  aria-label="Clear search"
                  className="grid size-9 shrink-0 aspect-square place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100"
                >
                  <LuX size={16} />
                </button>
              )}
            </form>

            <div className="-mt-1 flex items-center gap-2 overflow-x-auto text-xs [scrollbar-width:none]">
              <span className="shrink-0 text-ink-muted">Popular:</span>
              {quickSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onQueryChange(term)}
                  className="shrink-0 rounded-full border border-ink-border px-3 py-1.5 transition hover:bg-white/10"
                >
                  {term}
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

          {/* Product mosaic, desktop only */}
          <div aria-hidden className="hidden grid-cols-3 gap-4 lg:grid">
            {mosaic.map((p, i) => (
              <ProductImage
                key={p.id}
                product={p}
                className={cn("aspect-square w-full rounded-3xl shadow-pop ring-1 ring-white/10", mosaicStyle[i])}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsHero;
