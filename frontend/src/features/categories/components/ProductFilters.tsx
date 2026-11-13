import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import { formatCount, formatPrice } from "../../../lib/format";
import type { CategoryProductsState } from "../hooks/useCategoryProducts";

const FilterSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <details open className="group border-b border-border py-4 last:border-b-0">
    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold [&::-webkit-details-marker]:hidden">
      {title}
      <LuChevronDown size={16} className="text-muted-foreground transition-transform group-open:rotate-180" />
    </summary>
    <div className="mt-3 grid gap-2">{children}</div>
  </details>
);

const Check = ({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm transition hover:bg-surface-muted">
    <input type="checkbox" checked={checked} onChange={onChange} className="size-4.5 accent-primary" />
    <span className="flex-1 truncate">{label}</span>
    {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{formatCount(count)}</span>}
  </label>
);

const pricePresets = [
  { label: "Under 500", min: null, max: 500 },
  { label: "500 to 1,000", min: 500, max: 1000 },
  { label: "1,000 to 2,500", min: 1000, max: 2500 },
  { label: "Over 2,500", min: 2500, max: null },
] as const;

/** Used in the desktop sidebar and inside the phone sheet */
const ProductFilters = ({ f }: { f: CategoryProductsState }) => {
  const [brandQuery, setBrandQuery] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [lo, setLo] = useState(f.min?.toString() ?? "");
  const [hi, setHi] = useState(f.max?.toString() ?? "");

  const matching = f.brandFacets.filter((b) => b.name.toLowerCase().includes(brandQuery.trim().toLowerCase()));
  const visible = showAllBrands || brandQuery ? matching : matching.slice(0, 6);

  const applyPrice = (e: FormEvent) => {
    e.preventDefault();
    f.setPrice(lo === "" ? null : Number(lo), hi === "" ? null : Number(hi));
  };

  const applyPreset = (min: number | null, max: number | null) => {
    setLo(min?.toString() ?? "");
    setHi(max?.toString() ?? "");
    f.setPrice(min, max);
  };

  return (
    <div>
      <FilterSection title="Brand">
        <div className="relative">
          <LuSearch size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            aria-label="Search brands"
            placeholder="Search brands"
            className="h-10 w-full rounded-xl border border-border bg-background ps-9 pe-3 text-sm outline-none transition focus:border-primary"
          />
        </div>
        <div className="grid gap-0.5">
          {visible.map((b) => (
            <Check key={b.name} label={b.name} count={b.count} checked={f.selectedBrands.includes(b.name)} onChange={() => f.toggleBrand(b.name)} />
          ))}
          {visible.length === 0 && <p className="px-1 py-2 text-sm text-muted-foreground">No brands found</p>}
        </div>
        {!brandQuery && matching.length > 6 && (
          <button type="button" onClick={() => setShowAllBrands((v) => !v)} className="w-max text-xs font-bold text-link hover:underline">
            {showAllBrands ? "Show less" : `Show all ${matching.length}`}
          </button>
        )}
      </FilterSection>

      <FilterSection title="Price (Rs.)">
        <form onSubmit={applyPrice} className="grid gap-3">
          <div className="flex items-center gap-2">
            <input
              value={lo}
              onChange={(e) => setLo(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              aria-label="Minimum price"
              placeholder={String(f.bounds.min)}
              className="h-10 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-sm tabular-nums outline-none focus:border-primary"
            />
            <span className="text-muted-foreground">to</span>
            <input
              value={hi}
              onChange={(e) => setHi(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              aria-label="Maximum price"
              placeholder={String(f.bounds.max)}
              className="h-10 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-sm tabular-nums outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="h-10 rounded-full bg-ink text-sm font-bold text-ink-foreground transition hover:brightness-125">
            Apply price
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {pricePresets.map((p) => {
            const active = f.min === p.min && f.max === p.max;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => applyPreset(p.min, p.max)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active ? "border-ink bg-ink text-ink-foreground" : "border-border hover:border-border-strong",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Prices here run from {formatPrice(f.bounds.min)} to {formatPrice(f.bounds.max)}
        </p>
      </FilterSection>

      <FilterSection title="Customer rating">
        {[4, 3, 0].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm transition hover:bg-surface-muted">
            <input type="radio" name="rating" checked={f.rating === r} onChange={() => f.setRating(r)} className="size-4.5 accent-primary" />
            {r === 0 ? "Any rating" : `${r} stars and up`}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Availability">
        <Check label="In stock only" checked={f.stock} onChange={f.toggleStock} />
        <Check label="On sale" checked={f.sale} onChange={f.toggleSale} />
      </FilterSection>
    </div>
  );
};

export default ProductFilters;
