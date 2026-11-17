import { useMemo } from "react";
import type { ProductListItem } from "../../products/types/products.types";
import { productItems } from "../../../data/catalog.selectors";
import { useCartStore } from "../store/cartStore";
import type { CartLine } from "../types/cart.types";
import { getCartSummary } from "../lib/cart";

export interface CartViewLine {
  id: string;
  /** Fresh data from the catalog (falls back to the saved copy if the product disappeared) */
  product: ProductListItem;
  quantity: number;
  maxQuantity: number;   // stock and order limit
  unavailable: boolean;  // removed or out of stock
  overStock: boolean;    // asks for more than we have
  priceChange: number;   // new price minus the price when it was added (0 = same)
  lineTotal: number;
  lineSavings: number;
}

const productsById = new Map(productItems.map((p) => [p.id, p]));

export const useCartView = () => {
  const storedLines = useCartStore((s) => s.lines);
  const coupon = useCartStore((s) => s.coupon);

  return useMemo(() => {
    const lines: CartViewLine[] = Object.values(storedLines).map((stored) => {
      const fresh = productsById.get(stored.product.id);
      const product = fresh ?? stored.product;
      const maxQuantity = fresh ? Math.min(fresh.stockQuantity, fresh.maxPerOrder ?? Number.POSITIVE_INFINITY) : 0;
      const unavailable = !fresh || !fresh.inStock;
      const overStock = !unavailable && stored.quantity > maxQuantity;
      const billable = unavailable ? 0 : Math.min(stored.quantity, maxQuantity);
      const saving = Math.max(0, (product.oldPrice ?? product.price) - product.price);

      return {
        id: product.id,
        product,
        quantity: stored.quantity,
        maxQuantity,
        unavailable,
        overStock,
        priceChange: fresh ? fresh.price - stored.product.price : 0,
        lineTotal: product.price * billable,
        lineSavings: saving * billable,
      };
    });

    // Only items we can really deliver count towards the total
    const billable: Record<string, CartLine> = {};
    for (const l of lines) {
      if (!l.unavailable) billable[l.id] = { product: l.product, quantity: Math.min(l.quantity, l.maxQuantity) };
    }

    const summary = getCartSummary(billable, coupon);
    const unavailableCount = lines.filter((l) => l.unavailable).length;
    const overStockCount = lines.filter((l) => l.overStock).length;
    const priceChangedCount = lines.filter((l) => !l.unavailable && l.priceChange !== 0).length;

    const suggestions = productItems
      .filter((p) => !storedLines[p.id] && p.inStock)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 8);

    return {
      lines,
      summary,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      unavailableCount,
      overStockCount,
      priceChangedCount,
      canCheckout: lines.length > 0 && unavailableCount === 0 && overStockCount === 0,
      suggestions,
    };
  }, [storedLines, coupon]);
};

export type CartView = ReturnType<typeof useCartView>;
