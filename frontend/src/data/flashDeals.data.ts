import type { FlashDeal } from "../features/products/types/products.types";

/** Sample sale ending 5h 42m from now. The real end time comes from the API */
const endsAt = new Date(Date.now() + (5 * 3600 + 42 * 60) * 1000).toISOString();

export const flashDeals: FlashDeal[] = [
  { productId: "prod-basmati-rice-5kg", soldPercent: 72, endsAt },
  { productId: "prod-fresh-milk-1l", soldPercent: 45, endsAt },
  { productId: "prod-cooking-oil-5l", soldPercent: 88, endsAt },
  { productId: "prod-tea-leaves-950g", soldPercent: 31, endsAt },
  { productId: "prod-mineral-water-6x15l", soldPercent: 60, endsAt },
];
