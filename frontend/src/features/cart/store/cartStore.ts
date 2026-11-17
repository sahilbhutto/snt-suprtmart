import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { COUPONS } from "../../../lib/constants";
import { getCartSummary } from "../lib/cart";
import type { CartState } from "../types/cart.types";


const STORAGE_KEY = "snt-cart";


/** localStorage can throw (private mode, storage full). This keeps the app running */
const safeStorage: Storage = {
  get length() {
    try {
      return window.localStorage.length;
    } catch {
      return 0;
    }
  },
  clear: () => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  },
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  key: (index) => {
    try {
      return window.localStorage.key(index);
    } catch {
      return null;
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: {},
      saved: {},
      coupon: null,
      isOpen: false,

      setQuantity: (id, quantity) =>
        set((s) => {
          const line = s.lines[id];
          if (!line) return s;
          if (quantity <= 0) {
            const { [id]: _removed, ...rest } = s.lines;
            return { lines: rest };
          }
          return { lines: { ...s.lines, [id]: { ...line, quantity } } };
        }),

      saveForLater: (id) =>
        set((s) => {
          const line = s.lines[id];
          if (!line) return s;
          const { [id]: _removed, ...rest } = s.lines;
          return { lines: rest, saved: { ...s.saved, [id]: line.product } };
        }),

      moveToCart: (id) =>
        set((s) => {
          const product = s.saved[id];
          if (!product) return s;
          const { [id]: _removed, ...rest } = s.saved;
          return {
            saved: rest,
            lines: {
              ...s.lines,
              [id]: { product, quantity: (s.lines[id]?.quantity ?? 0) + 1 },
            },
          };
        }),

      removeSaved: (id) =>
        set((s) => {
          const { [id]: _removed, ...rest } = s.saved;
          return { saved: rest };
        }),

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
    }),
    {
      name: STORAGE_KEY,
      version: 1, // increase this when the CartLine or product shape changes
      storage: createJSONStorage(() => safeStorage),

      // Save only the data. Never save isOpen or the action functions
      partialize: (state) => ({
        lines: state.lines,
        saved: state.saved,
        coupon: state.coupon,
      }),

      // Data saved by an older version: start with an empty cart instead of crashing
      migrate: () => ({ lines: {}, saved: {}, coupon: null }),

      // Check the saved data before using it
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Pick<CartState, "lines" | "saved" | "coupon">>;

        const lines: CartState["lines"] = {};
        for (const [id, line] of Object.entries(p.lines ?? {})) {
          if (line?.product?.id === id && Number.isInteger(line.quantity) && line.quantity > 0) {
            lines[id] = line;
          }
        }

        return {
          ...current,
          lines,
          saved: p.saved ?? {},
          coupon: typeof p.coupon === "string" ? p.coupon : null,
        };
      },
    },
  ),
);

/** Keeps several browser tabs in sync */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) void useCartStore.persist.rehydrate();
  });
}

/** Totals, delivery fee, savings and free-delivery progress */
export const useCartSummary = () => {
  const lines = useCartStore((s) => s.lines);
  const coupon = useCartStore((s) => s.coupon);
  return useMemo(() => getCartSummary(lines, coupon), [lines, coupon]);
};
