/**
 * Re-export categories from the feature module for backward-compatible imports
 * from the shared data layer. Prefer importing from features/categories in new code.
 */
export { categories, collections } from "../features/categories/data/categories.data";
