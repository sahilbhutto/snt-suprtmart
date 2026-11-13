import type { ProductListItem } from "../../products/types/products.types";

export interface CartLine {
  product: ProductListItem;
  quantity: number;
}
