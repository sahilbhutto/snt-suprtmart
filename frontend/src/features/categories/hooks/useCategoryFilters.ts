
import { useCallback, useDeferredValue, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { CategoryItem } from "../../../types/catalog";
import { categoryItems as allCategoryItems } from "../../../data/catalog.selectors";

export const PAGE_SIZE = 8;

export type SortKey =
  | "popular"
  | "az"
  | "za"
  | "products"
  | "trending"
  | "newest";

export const categoryItems: CategoryItem[] = allCategoryItems;


// Sorting options
export const sortOptions: {
  value: SortKey;
  label: string;
}[] = [
  { value: "popular", label: "Most popular" },
  { value: "trending", label: "Trending this week" },
  { value: "newest", label: "Newest first" },
  { value: "products", label: "Most products" },
  { value: "az", label: "Name: A to Z" },
  { value: "za", label: "Name: Z to A" },
];

// Sorting functions
const sorters: Record<
  SortKey,
  (a: CategoryItem, b: CategoryItem) => number
> = {
  popular: (a, b) => b.popularity - a.popularity,

  trending: (a, b) =>
    (b.trend7d ?? 0) - (a.trend7d ?? 0) || b.popularity - a.popularity,

  newest: (a, b) =>
    Number(!!b.isNew) - Number(!!a.isNew) ||
    b.popularity - a.popularity,

  products: (a, b) => (b.productCount ?? 0) - (a.productCount ?? 0),

  az: (a, b) => a.name.localeCompare(b.name),

  za: (a, b) => b.name.localeCompare(a.name),
};

// URL validation
const isSort = (v: string | null): v is SortKey =>
  !!v && Object.hasOwn(sorters, v);

// Main filtering hook
export const useCategoryFilters = () => {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";

  const sort: SortKey = isSort(params.get("sort"))
    ? (params.get("sort") as SortKey)
    : "popular";

  const sale = params.get("sale") === "1";
  const isNew = params.get("new") === "1";

  const rawPage = Math.max(1, Number(params.get("page")) || 1);

  // Deferred search
  const deferredQ = useDeferredValue(q);

  // URL update helper
  const update = useCallback(
    (patch: Record<string, string | null>, replace = true) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === "") {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          }

          if (!("page" in patch)) {
            next.delete("page");
          }

          return next;
        },
        { replace },
      );
    },
    [setParams],
  );

  // 1. Search + filters
  const base = useMemo(() => {
    const needle = deferredQ.trim().toLowerCase();

    return categoryItems.filter(
      (category) =>
        (!needle || category.name.toLowerCase().includes(needle)) &&
        (!sale || category.hasDeals) &&
        (!isNew || category.isNew),
    );
  }, [deferredQ, sale, isNew]);

  // 2. Sorting
  const filtered = useMemo(
    () => [...base].sort(sorters[sort]),
    [base, sort],
  );

  // 3. Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  );

  const page = Math.min(rawPage, totalPages);

  const items = useMemo(
    () =>
      filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
      ),
    [filtered, page],
  );

  // 4. Return values + actions
  return {
    q,
    sort,
    sale,
    isNew,

    page,
    totalPages,
    items,

    total: filtered.length,
    allCount: base.length,

    isStale: q !== deferredQ,

    activeCount:
      Number(!!q.trim()) +
      Number(sale) +
      Number(isNew),

    setQuery: (v: string) => update({ q: v }),

    setSort: (v: SortKey) =>
      update({ sort: v === "popular" ? null : v }),

    toggleSale: () =>
      update({ sale: sale ? null : "1" }),

    toggleNew: () =>
      update({ new: isNew ? null : "1" }),

    setPage: (p: number) =>
      update({ page: p <= 1 ? null : String(p) }, false),

    clearQuery: () => update({ q: null }),

    clearAll: () => setParams({}, { replace: true }),
  };
};
