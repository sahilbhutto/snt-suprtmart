import { Link } from "react-router-dom";
import { LuSearch, LuTruck, LuX } from "react-icons/lu";
import Badge from "../../../components/ui/Badge";
import { categoryItems } from "../hooks/useCategoryFilters";
import rightSideImg from "../../../assets/images/all-categories-shopping.png";

interface CategoriesHeroProps {
  q: string;
  onQueryChange: (value: string) => void;
}

const stats = [
  { value: `${categoryItems.length}`, label: "categories" },
  { value: "70,000+", label: "products" },
  { value: "2 hrs", label: "delivery" },
];

const CategoriesHero = ({ q, onQueryChange }: CategoriesHeroProps) => {
  return (
    <section aria-labelledby="categories-title">
      <div className="relative overflow-hidden rounded-2x; bg-ink p-6 text-ink-foreground ring-1 ring-ink-border sm:rounded-[2.25rem] sm:p-10 lg:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-accent/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-1/4 size-96 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-ink-muted"
            >
              <Link to="/" className="transition hover:text-ink-foreground">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-ink-foreground">
                All categories
              </span>
            </nav>

            <Badge tone="glass" className="w-max gap-2 py-1.5 text-xs">
              <LuTruck size={14} /> Delivered in 2 hours
            </Badge>

            <h1
              id="categories-title"
              className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              All{" "}
              <span className="relative inline-block text-accent">
                categories
                <svg
                  aria-hidden
                  viewBox="0 0 200 9"
                  fill="none"
                  className="absolute -bottom-1.5 left-0 w-full"
                >
                  <path
                    d="M2 6.5C50 2 120 2 198 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="max-w-xl text-base text-ink-muted sm:text-lg">
              Explore every aisle of our store. Pick a category to see all its
              products, prices and offers.
            </p>

            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-xl items-center gap-1 rounded-full bg-white p-1.5 shadow-pop"
            >
              <LuSearch
                className="ms-3 shrink-0 text-neutral-500"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => onQueryChange(e.target.value)}
                aria-label="Search categories"
                placeholder="Find a category, e.g. Sea Food"
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

            <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-border pt-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="text-2xl font-extrabold tracking-tight">
                    {s.value}
                  </dd>
                  <dt className="text-xs text-ink-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: Grocery Hero Visual */}
          <div className="relative w-full flex min-h-[440] items-center justify-center sm:min-h-[340px] lg:min-h-[460px]">
            {/* Soft decorative glow */}
            <div
              aria-hidden
              className="absolute  right-0 top-1/2 aspect-square w-[85%] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
            />

            <img
              src={rightSideImg}
              alt="Fresh supermarket groceries and shopping cart"
              fetchPriority="high"
              decoding="async"
              className="
      relative z-10
      h-auto w-full
      max-h-75 max-w-115
      object-contain object-center
      lg:max-h-150 lg:max-w-180
      drop-shadow-xl
    "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesHero;
