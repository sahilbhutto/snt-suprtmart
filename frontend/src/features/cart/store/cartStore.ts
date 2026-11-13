import { useMemo } from "react";
import { create } from "zustand";
import type { CartLine } from "../types/cart.types";
import { COUPONS } from "../../../lib/constants";
import { getCartSummary } from "../lib/cart";
import type { ProductListItem } from "../../products/types/products.types";

type CouponResult = "applied" | "invalid" | "minimum";

interface CartState {
  lines: Record<string, CartLine>;
  coupon: string | null;
  isOpen: boolean;
  add: (product: ProductListItem, quantity?: number) => void;
  decrease: (id: string) => void;
  removeLine: (id: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
  open: () => void;
  close: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  lines: {},
  coupon: null,
  isOpen: false,

  add: (product, quantity = 1) =>
    set((s) => ({
      lines: {
        ...s.lines,
        [product.id]: {
          product,
          quantity: (s.lines[product.id]?.quantity ?? 0) + quantity,
        },
      },
    })),

  decrease: (id) =>
    set((s) => {
      const line = s.lines[id];
      if (!line) return s;
      if (line.quantity <= 1) {
        const { [id]: _removed, ...rest } = s.lines;
        return { lines: rest };
      }
      return {
        lines: { ...s.lines, [id]: { ...line, quantity: line.quantity - 1 } },
      };
    }),

  removeLine: (id) =>
    set((s) => {
      const { [id]: _removed, ...rest } = s.lines;
      return { lines: rest };
    }),

  clear: () => set({ lines: {}, coupon: null }),

  applyCoupon: (code) => {
    const key = code.trim().toUpperCase();
    const rule = COUPONS[key];
    if (!rule) return "invalid";
    const subtotal = Object.values(get().lines).reduce(
      (sum, l) => sum + l.product.price * l.quantity,
      0,
    );
    if (subtotal < rule.minSubtotal) return "minimum";
    set({ coupon: key });
    return "applied";
  },

  removeCoupon: () => set({ coupon: null }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

/** Totals, delivery fee, savings and free-delivery progress */
export const useCartSummary = () => {
  const lines = useCartStore((s) => s.lines);
  const coupon = useCartStore((s) => s.coupon);
  return useMemo(() => getCartSummary(lines, coupon), [lines, coupon]);
};
