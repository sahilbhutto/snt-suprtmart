import { LuArrowDownUp, LuLayoutGrid, LuSlidersHorizontal, LuTag, LuPackageCheck } from "react-icons/lu";
import type { ProductFiltersState } from "../hooks/useProductFilters";
import type { SelectOption } from "../../../components/ui/Select";
import type { ProductSort } from "../types/products.types";
import { productSortOptions } from "../../categories/hooks/useCategoryProducts";
import { formatCount, formatPrice } from "../../../lib/format";
import { categoryItems } from "../../../data/catalog.selectors";
import { getCollectionStyle } from "../../catalog/category.ui";
import Select from "../../../components/ui/Select";
import ToggleButton from "../../../components/ui/ToggleButton";
import FilterChip from "../../../components/ui/FilterChip";

interface ProductToolbarProps {
  f: ProductFiltersState;
  onOpenFilters: () => void;
  /** Hide the category dropdown when the category is fixed */
  showCategory?: boolean;
}

const sortChoices: SelectOption<ProductSort>[] = productSortOptions.map((o) => ({ value: o.value, label: o.label }));

const ProductToolbar = ({ f, onOpenFilters, showCategory = true }: ProductToolbarProps) => {
  const allCount = Object.values(f.categoryFacets).reduce((sum, n) => sum + n, 0);

  const categoryOptions: SelectOption<string>[] = [
    { value: "", label: "All categories", meta: formatCount(allCount), icon: <LuLayoutGrid size={16} /> },
    ...categoryItems
      .filter((c) => (f.categoryFacets[c.slug] ?? 0) > 0 || c.slug === f.category)
      .map((c) => {
        const Icon = getCollectionStyle(c.collectionSlug).icon;
        return { value: c.slug, label: c.name, meta: formatCount(f.categoryFacets[c.slug] ?? 0), icon: <Icon size={16} /> };
      }),
  ];

  const categoryLabel = categoryItems.find((c) => c.slug === f.category)?.name;

  const priceLabel =
    f.min !== null && f.max !== null
      ? `${formatPrice(f.min)} to ${formatPrice(f.max)}`
      : f.min !== null
        ? `Over ${formatPrice(f.min)}`
        : f.max !== null
          ? `Under ${formatPrice(f.max)}`
          : null;

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <div className="flex gap-3 lg:flex-1">
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

          {showCategory && (
            <Select
              caption="Category"
              value={f.category}
              options={categoryOptions}
              onChange={f.setCategory}
              leadingIcon={<LuLayoutGrid size={18} />}
              className="min-w-0 flex-1"
            />
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Select
            caption="Sort by"
            value={f.sort}
            options={sortChoices}
            onChange={f.setSort}
            leadingIcon={<LuArrowDownUp size={18} />}
            align="end"
            className="lg:w-72"
          />
          <div className="flex gap-3">
            <ToggleButton pressed={f.sale} onClick={f.toggleSale} icon={<LuTag size={16} />}>On sale</ToggleButton>
            <ToggleButton pressed={f.stock} onClick={f.toggleStock} icon={<LuPackageCheck size={16} />}>In stock</ToggleButton>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className="me-1 text-sm" aria-live="polite">
          <b className="tabular-nums">{formatCount(f.total)}</b>{" "}
          <span className="text-muted-foreground">{f.total === 1 ? "product" : "products"}</span>
        </p>

        {f.q.trim() && <FilterChip label={`Search: ${f.q.trim()}`} onRemove={() => f.setQuery("")} />}
        {showCategory && f.category && categoryLabel && <FilterChip label={categoryLabel} onRemove={() => f.setCategory("")} />}
        {f.brands.map((slug) => {
          const name = f.brandFacets.find((b) => b.slug === slug)?.name ?? slug;
          return <FilterChip key={slug} label={name} onRemove={() => f.toggleBrand(slug)} />;
        })}
        {priceLabel && <FilterChip label={priceLabel} onRemove={() => f.setPrice(null, null)} />}
        {f.rating > 0 && <FilterChip label={`${f.rating} stars and up`} onRemove={() => f.setRating(0)} />}
        {f.sale && <FilterChip label="On sale" onRemove={f.toggleSale} />}
        {f.stock && <FilterChip label="In stock" onRemove={f.toggleStock} />}

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
