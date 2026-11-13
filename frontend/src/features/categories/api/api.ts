/**
 * Categories API layer.
 * Replace mock implementations with real fetch/axios calls when backend is ready.
 */

import type { CategoryListQuery, CategoryListResponse } from "../types/categories.types";

// Placeholder – wire to real endpoint later
export async function fetchCategories(
  _query: CategoryListQuery = {},
): Promise<CategoryListResponse> {
  throw new Error("API not implemented – use local data selectors for now");
}
