import type { CartLine } from "../types/cart";
import { COUPONS, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "./constants";

export interface CartSummary {
  count: number;
  subtotal: number;
  savings: number;
  discount: number;
  delivery: number;
  total: number;
  remainingForFree: number;
  freeProgress: number; // 0 - 100
}

export const getCartSummary = (lines: Record<string, CartLine>, coupon: string | null): CartSummary => {
  const items = Object.values(lines);

  const count = items.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = items.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const savings = items.reduce(
    (sum, l) => sum + Math.max(0, (l.product.oldPrice ?? l.product.price) - l.product.price) * l.quantity,
    0,
  );

  const rule = coupon ? COUPONS[coupon] : undefined;
  const discount = rule && subtotal >= rule.minSubtotal ? rule.amount : 0;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  return {
    count,
    subtotal,
    savings: savings + discount,
    discount,
    delivery,
    total: Math.max(0, subtotal - discount + delivery),
    remainingForFree: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
    freeProgress: Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100),
  };
};
