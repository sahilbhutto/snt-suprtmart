import { LuArrowDownUp, LuSlidersHorizontal, LuX } from "react-icons/lu";
import Select from "../../../components/ui/Select";
import type { SelectOption } from "../../../components/ui/Select";
import { formatCount, formatPrice } from "../../../lib/format";
import { productSortOptions } from "../hooks/useCategoryProducts";
import type { CategoryProductsState, ProductSort } from "../hooks/useCategoryProducts";

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <button
    type="button"
    onClick={onRemove}
    aria-label={`Remove filter ${label}`}
    className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-link transition hover:brightness-95"
  >
    {label}
    <LuX size={14} />
  </button>
);

interface ProductToolbarProps {
  f: CategoryProductsState;
  onOpenFilters: () => void;
}

const sortChoices: SelectOption<ProductSort>[] = productSortOptions.map((o) => ({ value: o.value, label: o.label }));

const ProductToolbar = ({ f, onOpenFilters }: ProductToolbarProps) => {
  const priceLabel =
    f.min !== null && f.max !== null
      ? `${formatPrice(f.min)} to ${formatPrice(f.max)}`
      : f.min !== null
        ? `Over ${formatPrice(f.min)}`
        : f.max !== null
          ? `Under ${formatPrice(f.max)}`
          : null;

  return (
    <div className="grid gap-3">
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-14 shrink-0 items-center gap-2 rounded-2xl border border-border bg-surface px-4 text-sm font-bold shadow-card transition hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <LuSlidersHorizontal size={18} />
          Filters
          {f.activeCount > 0 && (
            <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
              {f.activeCount}
            </span>
          )}
        </button>

        <p className="hidden flex-1 items-center text-sm lg:flex" aria-live="polite">
          <b className="me-1.5 tabular-nums">{formatCount(f.total)}</b>
          <span className="text-muted-foreground">{f.total === 1 ? "product" : "products"}</span>
        </p>

        <Select
          caption="Sort by"
          value={f.sort}
          options={sortChoices}
          onChange={f.setSort}
          leadingIcon={<LuArrowDownUp size={18} />}
          align="end"
          className="min-w-0 flex-1 lg:w-72 lg:flex-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="me-1 text-sm lg:hidden" aria-live="polite">
          <b className="tabular-nums">{formatCount(f.total)}</b> <span className="text-muted-foreground">products</span>
        </p>
        {f.selectedBrands.map((b) => (
          <FilterChip key={b} label={b} onRemove={() => f.toggleBrand(b)} />
        ))}
        {priceLabel && <FilterChip label={priceLabel} onRemove={() => f.setPrice(null, null)} />}
        {f.rating > 0 && <FilterChip label={`${f.rating} stars and up`} onRemove={() => f.setRating(0)} />}
        {f.stock && <FilterChip label="In stock" onRemove={f.toggleStock} />}
        {f.sale && <FilterChip label="On sale" onRemove={f.toggleSale} />}
        {f.hasFilters && (
          <button type="button" onClick={f.clearAll} className="text-xs font-bold text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline">
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductToolbar;
