import type { Category } from "../../categories/types/categories.types";
import type {
  BrandSummary,
  CategorySummary,
  Product,
  ProductDerived,
  ProductListItem,
} from "../types/products.types";

/** A stored product plus its calculated fields (no category or brand summary yet) */
type ProductWithDerived = Product & ProductDerived;

export const getDiscountPercent = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

export const withDerived = (product: Product): ProductWithDerived => ({
  ...product,
  inStock: product.stockQuantity > 0,
  discountPercent: getDiscountPercent(product.price, product.oldPrice),
});

/**
 * Mock version of the server's populate / $lookup.
 * When the real API exists it returns this shape and you delete this function.
 */
export const toListItem = (
  product: Product,
  categoriesById: Map<string, Category>,
  brandsById: Map<string, BrandSummary>,
): ProductListItem => {
  const category = categoriesById.get(product.categoryId);
  const brand = brandsById.get(product.brandId);

  // Missing links are data mistakes. Warn in development instead of hiding them
  if (import.meta.env.DEV) {
    if (!category) console.warn(`Product "${product.slug}": unknown categoryId "${product.categoryId}"`);
    if (!brand) console.warn(`Product "${product.slug}": unknown brandId "${product.brandId}"`);
  }

  const categorySummary: CategorySummary = category
    ? { id: category.id, slug: category.slug, name: category.name }
    : { id: product.categoryId, slug: "unknown", name: "Unknown category" };

  const brandSummary: BrandSummary = brand
    ? { id: brand.id, slug: brand.slug, name: brand.name }
    : { id: product.brandId, slug: "unknown", name: "Unknown brand" };

  return {
    ...withDerived(product),
    category: categorySummary,
    brand: brandSummary,
  };
};

/** The small pill on a product card. The text is calculated, never stored */
export const getProductBadge = (
  p: Pick<ProductListItem, "discountPercent" | "isNew" | "inStock">,
): string | null => {
  if (!p.inStock) return "Out of stock";
  if (p.discountPercent > 0) return `Save ${p.discountPercent}%`;
  if (p.isNew) return "New";
  return null;
};
