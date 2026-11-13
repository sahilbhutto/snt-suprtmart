
import type { ReactNode } from "react";
import {
  LuSlidersHorizontal,
  LuSparkles,
  LuTag,
  LuX,
} from "react-icons/lu";

import Select from "../../../components/ui/Select";
import type { SelectOption } from "../../../components/ui/Select";
import { cn } from "../../../lib/cn";
import { formatCount } from "../../../lib/format";
import { sortOptions } from "../hooks/useCategoryFilters";
import type { SortKey } from "../hooks/useCategoryFilters";

interface CategoryToolbarProps {
  q: string;
  sort: SortKey;
  sale: boolean;
  isNew: boolean;
  total: number;
  allCount: number;
  facets: Record<string, number>;
  activeCount: number;
  onSort: (v: SortKey) => void;
  onToggleSale: () => void;
  onToggleNew: () => void;
  onClearQuery: () => void;
  onClearAll: () => void;
}

const ToggleButton = ({
  pressed,
  onClick,
  icon,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(
      "flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-bold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex-none",
      pressed
        ? "border-ink bg-ink text-ink-foreground"
        : "border-border bg-surface hover:border-border-strong",
    )}
  >
    {icon}
    {children}
  </button>
);

const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
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

const CategoryToolbar = (p: CategoryToolbarProps) => {
  const sortChoices: SelectOption<SortKey>[] = sortOptions.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <div className="grid gap-4">
      {/* Toolbar controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <div className="grid gap-3 sm:grid-cols-2 lg:flex-1">
          <Select
            caption="Sort by"
            value={p.sort}
            options={sortChoices}
            onChange={p.onSort}
            leadingIcon={<LuSlidersHorizontal size={18} />}
            align="end"
          />
        </div>

        <div className="flex gap-3">
          <ToggleButton
            pressed={p.sale}
            onClick={p.onToggleSale}
            icon={<LuTag size={16} />}
          >
            On sale
          </ToggleButton>

          <ToggleButton
            pressed={p.isNew}
            onClick={p.onToggleNew}
            icon={<LuSparkles size={16} />}
          >
            New
          </ToggleButton>
        </div>
      </div>

      {/* Results and active filters */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="me-1 text-sm" aria-live="polite">
          <b className="tabular-nums">{formatCount(p.total)}</b>{" "}
          <span className="text-muted-foreground">
            {p.total === 1 ? "category" : "categories"}
          </span>
        </p>

        {p.q.trim() && (
          <FilterChip
            label={`Search: ${p.q.trim()}`}
            onRemove={p.onClearQuery}
          />
        )}

        {p.sale && (
          <FilterChip
            label="On sale"
            onRemove={p.onToggleSale}
          />
        )}

        {p.isNew && (
          <FilterChip
            label="New"
            onRemove={p.onToggleNew}
          />
        )}

        {p.activeCount > 0 && (
          <button
            type="button"
            onClick={p.onClearAll}
            className="text-xs font-bold text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryToolbar;
