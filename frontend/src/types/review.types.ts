export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: StarRating;
  title?: string;
  body: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string; // ISO 8601
}

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Record<StarRating, number>;
}
