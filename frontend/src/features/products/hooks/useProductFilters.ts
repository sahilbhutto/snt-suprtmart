import { useCallback, useDeferredValue, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductSort } from "../../categories/hooks/useCategoryProducts";
import { DEFAULT_PRODUCT_SORT, PRODUCT_PAGE_SIZE, PRODUCT_SORTS, type ProductListItem } from "../types/products.types";
import { productItems } from "../../../data/catalog.selectors";

export const productSortOptions: { value: ProductSort; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest discount" },
];

const sorters: Record<ProductSort, (a: ProductListItem, b: ProductListItem) => number> = {
  popular: (a, b) => b.sold - a.sold,
  newest: (a, b) =>
    Number(b.isNew) - Number(a.isNew) || Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.sold - a.sold,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.sold - a.sold,
  discount: (a, b) => b.discountPercent - a.discountPercent || b.sold - a.sold,
};

const isSort = (v: string | null): v is ProductSort =>
  !!v && (PRODUCT_SORTS as readonly string[]).includes(v);

const toNumber = (v: string | null) => {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

interface Criteria {
  q: string;
  category: string;
  brands: string[];
  min: number | null;
  max: number | null;
  rating: number;
  stock: boolean;
  sale: boolean;
}

/** skip lets us count a facet while ignoring its own filter */
const matches = (p: ProductListItem, c: Criteria, skip?: "category" | "brand") => {
  if (c.q) {
    const haystack = `${p.name} ${p.brand.name} ${p.category.name}`.toLowerCase();
    if (!c.q.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  if (skip !== "category" && c.category && p.category.slug !== c.category) return false;
  if (skip !== "brand" && c.brands.length > 0 && !c.brands.includes(p.brand.slug)) return false;
  if (c.min !== null && p.price < c.min) return false;
  if (c.max !== null && p.price > c.max) return false;
  if (c.rating > 0 && p.rating < c.rating) return false;
  if (c.stock && !p.inStock) return false;
  if (c.sale && p.discountPercent === 0) return false;
  return true;
};

interface Options {
  /** Fixes the category (used by the single category page) */
  categorySlug?: string;
}

export const useProductFilters = ({ categorySlug }: Options = {}) => {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const category = categorySlug ?? params.get("category") ?? "";
  const brandsKey = params.getAll("brand").join("|");
  const brandList = useMemo(() => (brandsKey ? brandsKey.split("|") : []), [brandsKey]);
  const min = toNumber(params.get("min"));
  const max = toNumber(params.get("max"));
  const rating = toNumber(params.get("rating")) ?? 0;
  const stock = params.get("stock") === "1";
  const sale = params.get("sale") === "1";
  const sort: ProductSort = isSort(params.get("sort")) ? (params.get("sort") as ProductSort) : DEFAULT_PRODUCT_SORT;
  const rawPage = Math.max(1, Number(params.get("page")) || 1);

  // Keeps typing smooth: the list re-filters a moment after the input updates
  const deferredQ = useDeferredValue(q);

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void, keepPage = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          if (!keepPage) next.delete("page"); // any filter change goes back to page 1
          return next;
        },
        { replace: !keepPage },
      );
    },
    [setParams],
  );

  const setOrDelete = (next: URLSearchParams, key: string, value: string | null) => {
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
  };

  /* Products this page is allowed to show */
  const pool = useMemo(
    () => (categorySlug ? productItems.filter((p) => p.category.slug === categorySlug) : productItems),
    [categorySlug],
  );

  const criteria = useMemo<Criteria>(
    () => ({ q: deferredQ.trim().toLowerCase(), category, brands: brandList, min, max, rating, stock, sale }),
    [deferredQ, category, brandList, min, max, rating, stock, sale],
  );

  /* Results */
  const results = useMemo(
    () => pool.filter((p) => matches(p, criteria)).sort(sorters[sort]),
    [pool, criteria, sort],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PRODUCT_PAGE_SIZE));
  const page = Math.min(rawPage, totalPages);
  const items = useMemo(
    () => results.slice((page - 1) * PRODUCT_PAGE_SIZE, page * PRODUCT_PAGE_SIZE),
    [results, page],
  );

  /* Facets: counts that ignore their own filter, so options never disappear */
  const categoryFacets = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pool) {
      if (matches(p, criteria, "category")) counts[p.category.slug] = (counts[p.category.slug] ?? 0) + 1;
    }
    return counts;
  }, [pool, criteria]);

  const brandFacets = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const p of pool) {
      const entry = map.get(p.brand.slug) ?? { slug: p.brand.slug, name: p.brand.name, count: 0 };
      if (matches(p, criteria, "brand")) entry.count += 1;
      map.set(p.brand.slug, entry);
    }
    return [...map.values()]
      .filter((b) => b.count > 0 || brandList.includes(b.slug))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [pool, criteria, brandList]);

  const bounds = useMemo(() => {
    if (pool.length === 0) return { min: 0, max: 0 };
    const prices = pool.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [pool]);

  const activeCount =
    Number(!!q.trim()) +
    Number(!!category && !categorySlug) +
    brandList.length +
    Number(min !== null || max !== null) +
    Number(rating > 0) +
    Number(stock) +
    Number(sale);

  return {
    items,
    total: results.length,
    poolSize: pool.length,
    page,
    totalPages,
    isStale: q !== deferredQ,

    q,
    category,
    brands: brandList,
    min,
    max,
    rating,
    stock,
    sale,
    sort,

    categoryFacets,
    brandFacets,
    bounds,
    activeCount,
    hasFilters: activeCount > 0,

    setQuery: (v: string) => update((next) => setOrDelete(next, "q", v)),
    setCategory: (slug: string) => update((next) => setOrDelete(next, "category", slug)),
    toggleBrand: (slug: string) =>
      update((next) => {
        const set = new Set(next.getAll("brand"));
        if (set.has(slug)) set.delete(slug);
        else set.add(slug);
        next.delete("brand");
        set.forEach((b) => next.append("brand", b));
      }),
    setPrice: (lo: number | null, hi: number | null) =>
      update((next) => {
        setOrDelete(next, "min", lo === null ? null : String(lo));
        setOrDelete(next, "max", hi === null ? null : String(hi));
      }),
    setRating: (value: number) => update((next) => setOrDelete(next, "rating", value ? String(value) : null)),
    toggleStock: () => update((next) => setOrDelete(next, "stock", stock ? null : "1")),
    toggleSale: () => update((next) => setOrDelete(next, "sale", sale ? null : "1")),
    setSort: (value: ProductSort) =>
      update((next) => setOrDelete(next, "sort", value === DEFAULT_PRODUCT_SORT ? null : value)),
    setPage: (p: number) => update((next) => setOrDelete(next, "page", p <= 1 ? null : String(p)), true),
    clearAll: () => setParams({}, { replace: true }),
  };
};

export type ProductFiltersState = ReturnType<typeof useProductFilters>;
