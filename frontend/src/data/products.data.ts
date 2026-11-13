/**
 * Re-export products from the feature module for backward-compatible imports
 * from the shared data layer. Prefer importing from features/products in new code.
 */
export { products } from "../features/products/data/products.data";
