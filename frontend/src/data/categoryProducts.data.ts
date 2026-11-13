import type { Category } from "../features/categories/types/categories.types";
import type { ProductListItem } from "../features/products/types/products.types";
import { productItems } from "./catalog.selectors";

const cache = new Map<string, ProductListItem[]>();

/**
 * Returns ProductListItem[] belonging to a category (by id).
 * Cached for performance in list views.
 */
export const getCategoryProducts = (
  category: Pick<Category, "id" | "slug">,
): ProductListItem[] => {
  const key = category.slug;
  const cached = cache.get(key);
  if (cached) return cached;

  const list = productItems.filter((p) => p.categoryId === category.id);

  cache.set(key, list);
  return list;
};
