import type { Product } from "./catalog";

export interface CartLine {
  product: Product;
  quantity: number;
}
