import type { AisleGroup, NavItem, TrendingTab } from "../types/catalog";
import type { CategoryListItem } from "../features/categories/types/categories.types";
import type { FlashDeal, ProductListItem } from "../features/products/types/products.types";
import { toListItem } from "../features/products/lib/product";
import { brands } from "./brands.data";
import { categories, collections } from "./category.data";
import { flashDeals } from "./flashDeals.data";
import { products } from "./products.data";


const categoriesById = new Map(categories.map((c) => [c.id, c]));

const brandsById = new Map(brands.map((b) => [b.id, b]));

export const productItems: ProductListItem[] = products
  .filter((p) => p.isActive)
  .map((p) => toListItem(p, categoriesById, brandsById));

const productsById = new Map(productItems.map((p) => [p.id, p]));


const statsFor = (categoryId: string) => {
  const list = productItems.filter((p) => p.categoryId === categoryId);
  return {
    productCount: list.length,
    minPrice: list.length ? Math.min(...list.map((p) => p.price)) : null,
    inStock: list.some((p) => p.inStock),
    hasDeals: list.some((p) => p.discountPercent > 0),
  };
};

export const categoryItems: CategoryListItem[] = categories
  .filter((c) => c.isActive)
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((c) => ({ ...c, ...statsFor(c.id) }));

/* ---------- Home page ---------- */

export const getFeaturedCategories = (limit = 12) =>
  categoryItems.filter((c) => c.isFeatured && c.productCount > 0).slice(0, limit);

export const getNavItems = (limit = 5): NavItem[] => [
  ...getFeaturedCategories(limit).map((c) => ({ label: c.name, to: `/category/${c.slug}` })),
  { label: "Deals", to: "/deals", highlight: true },
];

export const getAisleGroups = (): AisleGroup[] =>
  [...collections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((col) => ({
      title: col.name,
      links: categoryItems
        .filter((c) => c.collectionSlug === col.slug && c.productCount > 0)
        .map((c) => ({ label: c.name, count: c.productCount, slug: c.slug })),
    }))
    .filter((group) => group.links.length > 0);

export const getFlashDeals = (): { product: ProductListItem; deal: FlashDeal }[] =>
  flashDeals.flatMap((deal) => {
    const product = productsById.get(deal.productId);
    return product && product.inStock ? [{ product, deal }] : [];
  });

export const getBrandsWithCounts = () =>
  brands
    .map((b) => ({ ...b, productCount: productItems.filter((p) => p.brandId === b.id).length }))
    .filter((b) => b.productCount > 0);

export const getTrendingProducts = (tab: TrendingTab, limit = 10): ProductListItem[] => {
  const bySold = [...productItems].sort((a, b) => b.sold - a.sold);
  switch (tab) {
    case "new":
      return [...productItems.filter((p) => p.isNew), ...bySold.filter((p) => !p.isNew)].slice(0, limit);
    case "top-rated":
      return [...productItems].sort((a, b) => b.rating - a.rating || b.sold - a.sold).slice(0, limit);
    case "under-500":
      return bySold.filter((p) => p.price < 500).slice(0, limit);
    default:
      return bySold.slice(0, limit);
  }
};
