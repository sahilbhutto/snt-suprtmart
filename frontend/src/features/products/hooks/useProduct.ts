import { useMemo } from "react";
import {
  getBestSellers,
  getCategoryProducts,
  getProductBySlug,
  getProductReviews,
  getReviewSummary,
} from "../../../data/catalog.selectors";
import type { ProductListItem } from "../types/products.types";
import type { ProductReview, ReviewSummary } from "../../../types/review.types";

export interface ProductDetailData {
  product: ProductListItem;
  categoryProducts: ProductListItem[];
  bestSellers: ProductListItem[];
  reviews: ProductReview[];
  summary: ReviewSummary;
}

export const useProduct = (slug?: string): ProductDetailData | null =>
  useMemo(() => {
    const product = slug ? getProductBySlug(slug) : undefined;
    if (!product) return null;
    return {
      product,
      categoryProducts: getCategoryProducts(product),
      bestSellers: getBestSellers(product.id),
      reviews: getProductReviews(product.id),
      summary: getReviewSummary(product),
    };
  }, [slug]);
