import type { ProductReview } from "../types/review.types";

export const reviews: ProductReview[] = [
  { id: "rev-1", productId: "prod-basmati-rice-5kg", authorName: "Ayesha K.", rating: 5, title: "Perfect for biryani", body: "Grains are long and aromatic and cook fluffy every time. The pack was sealed and arrived the same day.", verifiedPurchase: true, helpfulCount: 24, createdAt: "2026-02-14T10:00:00.000Z" },
  { id: "rev-2", productId: "prod-basmati-rice-5kg", authorName: "Bilal A.", rating: 5, body: "Good value for a 5 kg pack. Will order again.", verifiedPurchase: true, helpfulCount: 9, createdAt: "2026-02-03T10:00:00.000Z" },
  { id: "rev-3", productId: "prod-basmati-rice-5kg", authorName: "Sana M.", rating: 4, title: "Good quality", body: "Nice rice, a few broken grains but overall very good.", verifiedPurchase: true, helpfulCount: 4, createdAt: "2026-01-21T10:00:00.000Z" },
  { id: "rev-4", productId: "prod-basmati-rice-5kg", authorName: "Hina R.", rating: 3, body: "Okay for everyday use, I expected slightly longer grains.", verifiedPurchase: false, helpfulCount: 1, createdAt: "2026-01-09T10:00:00.000Z" },
  { id: "rev-5", productId: "prod-fresh-milk-1l", authorName: "Usman A.", rating: 5, title: "Always fresh", body: "Delivered cold, with a long expiry date. We order it every week.", verifiedPurchase: true, helpfulCount: 12, createdAt: "2026-02-10T10:00:00.000Z" },
  { id: "rev-6", productId: "prod-fresh-milk-1l", authorName: "Maria H.", rating: 4, body: "Good taste and fresh. Packaging could be better.", verifiedPurchase: true, helpfulCount: 3, createdAt: "2026-01-30T10:00:00.000Z" },
  { id: "rev-7", productId: "prod-tea-leaves-950g", authorName: "Farhan S.", rating: 5, title: "Strong, rich tea", body: "Great colour and aroma. Lasts a long time.", verifiedPurchase: true, helpfulCount: 7, createdAt: "2026-02-01T10:00:00.000Z" },
];
