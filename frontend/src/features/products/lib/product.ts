import type { Category } from "../../categories/types/categories.types";
import type {
  CategorySummary,
  Product,
  ProductDerived,
  ProductListItem,
} from "../types/products.types";


type ProductWithDerived = Product & ProductDerived;

export const getDiscountPercent = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

export const withDerived = (product: Product): ProductWithDerived => ({
  ...product,
  inStock: product.stockQuantity > 0,
  discountPercent: getDiscountPercent(product.price, product.oldPrice),
});


export const toListItem = (
  product: Product,
  categoriesById: Map<string, Category>,
): ProductListItem => {
  const category = categoriesById.get(product.categoryId);

  if (import.meta.env.DEV) {
    if (!category) console.warn(`Product "${product.slug}": unknown categoryId "${product.categoryId}"`);
  }

  const categorySummary: CategorySummary = category
    ? { id: category.id, slug: category.slug, name: category.name }
    : { id: product.categoryId, slug: "unknown", name: "Unknown category" };


  return {
    ...withDerived(product),
    category: categorySummary,
  };
};


export const getProductBadge = (
  p: Pick<ProductListItem, "discountPercent" | "isNew" | "inStock">,
): string | null => {
  if (!p.inStock) return "Out of stock";
  if (p.discountPercent > 0) return `Save ${p.discountPercent}%`;
  if (p.isNew) return "New";
  return null;
};
