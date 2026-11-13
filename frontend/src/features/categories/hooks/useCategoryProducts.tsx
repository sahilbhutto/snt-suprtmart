import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategoryProducts } from "../../../data/categoryProducts.data";
import type { CategoryItem } from "../../../types/catalog";
import type { ProductListItem } from "../../products/types/products.types";

export const PAGE_SIZE = 12;

export type ProductSort =
  | "popular"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";

export const productSortOptions: { value: ProductSort; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest discount" },
];

const discountOf = (p: ProductListItem) =>
  p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0;

const sorters: Record<
  ProductSort,
  (a: ProductListItem, b: ProductListItem) => number
> = {
  popular: (a, b) => b.sold - a.sold,
  newest: (a, b) => Number(b.isNew) - Number(a.isNew) || b.sold - a.sold,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.sold - a.sold,
  discount: (a, b) => discountOf(b) - discountOf(a),
};

const isSort = (v: string | null): v is ProductSort => !!v && v in sorters;

const toNumber = (v: string | null) => {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const useCategoryProducts = (category: CategoryItem) => {
  const [params, setParams] = useSearchParams();

  const all = useMemo(() => getCategoryProducts(category), [category]);

  const selectedBrands = params.getAll("brand");
  const min = toNumber(params.get("min"));
  const max = toNumber(params.get("max"));
  const rating = toNumber(params.get("rating")) ?? 0;
  const stock = params.get("stock") === "1";
  const sale = params.get("sale") === "1";
  const sort: ProductSort = isSort(params.get("sort"))
    ? (params.get("sort") as ProductSort)
    : "popular";
  const rawPage = Math.max(1, Number(params.get("page")) || 1);

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void, keepPage = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          if (!keepPage) next.delete("page");
          return next;
        },
        { replace: !keepPage },
      );
    },
    [setParams],
  );

  const setOrDelete = (
    next: URLSearchParams,
    key: string,
    value: string | null,
  ) => {
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
  };

  useEffect(() => {
    const quick = params.get("filter");
    if (!quick) return;
    update((next) => {
      next.delete("filter");
      if (quick === "On sale") next.set("sale", "1");
      if (quick === "New arrivals") next.set("sort", "newest");
      if (quick === "Best sellers") next.delete("sort");
    });
  }, [params, update]);

  const bounds = useMemo(() => {
    if (all.length === 0) return { min: 0, max: 0 };
    const prices = all.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [all]);

  const brandFacets = useMemo(() => {
    const counts = all.reduce<Record<string, number>>((acc, p) => {
      const name = p.brand?.name;
      if (name) acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [all]);

  const filtered = useMemo(() => {
    const list = all.filter(
      (p) =>
        (selectedBrands.length === 0 ||
          (p.brand?.name && selectedBrands.includes(p.brand.name))) &&
        (min === null || p.price >= min) &&
        (max === null || p.price <= max) &&
        (rating === 0 || p.rating >= rating) &&
        (!stock || p.inStock) &&
        (!sale || p.discountPercent > 0),
    );
    return list.sort(sorters[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, selectedBrands.join("|"), min, max, rating, stock, sale, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(rawPage, totalPages);
  const items = useMemo(
    () =>
      filtered.slice(
        (page - 1) * PAGE_SIZE,
        (page - 1) * PAGE_SIZE + PAGE_SIZE,
      ),
    [filtered, page],
  );

  const activeCount =
    selectedBrands.length +
    Number(min !== null || max !== null) +
    Number(rating > 0) +
    Number(stock) +
    Number(sale);

  const bestSellers = useMemo(
    () => [...all].sort(sorters.popular).slice(0, 8),
    [all],
  );

  return {
    all,
    items,
    bestSellers,
    total: filtered.length,
    page,
    totalPages,
    bounds,
    brandFacets,
    selectedBrands,
    min,
    max,
    rating,
    stock,
    sale,
    sort,
    activeCount,
    hasFilters: activeCount > 0,

    toggleBrand: (brand: string) =>
      update((next) => {
        const set = new Set(next.getAll("brand"));
        if (set.has(brand)) set.delete(brand);
        else set.add(brand);
        next.delete("brand");
        set.forEach((b) => next.append("brand", b));
      }),
    setPrice: (lo: number | null, hi: number | null) =>
      update((next) => {
        setOrDelete(next, "min", lo === null ? null : String(lo));
        setOrDelete(next, "max", hi === null ? null : String(hi));
      }),
    setRating: (value: number) =>
      update((next) =>
        setOrDelete(next, "rating", value ? String(value) : null),
      ),
    toggleStock: () =>
      update((next) => setOrDelete(next, "stock", stock ? null : "1")),
    toggleSale: () =>
      update((next) => setOrDelete(next, "sale", sale ? null : "1")),
    setSort: (value: ProductSort) =>
      update((next) =>
        setOrDelete(next, "sort", value === "popular" ? null : value),
      ),
    setPage: (p: number) =>
      update(
        (next) => setOrDelete(next, "page", p <= 1 ? null : String(p)),
        true,
      ),
    clearAll: () => setParams({}, { replace: true }),
  };
};

export type CategoryProductsState = ReturnType<typeof useCategoryProducts>;
