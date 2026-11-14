import type { ProductListItem } from "../../products/types/products.types";

export interface CartLine {
  product: ProductListItem;
  quantity: number;
}

export type CouponResult = "applied" | "invalid" | "minimum";

export interface CartState {
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
  saved: Record<string, ProductListItem>;
  setQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
}
