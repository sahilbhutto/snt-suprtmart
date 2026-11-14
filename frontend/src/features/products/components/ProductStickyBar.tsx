import { LuShoppingCart } from "react-icons/lu";
import ProductImage from "./ProductImage";
import type { ProductListItem } from "../types/products.types";
import { useCartStore } from "../../cart/store/cartStore";
import { cn } from "../../../lib/cn";
import { formatPrice } from "../../../lib/format";
import QuantityStepper from "../../../components/ui/QuantityStepper";
import Button from "../../../components/ui/Button";

interface ProductStickyBarProps {
  product: ProductListItem;
  visible: boolean;
}

const ProductStickyBar = ({ product, visible }: ProductStickyBarProps) => {
  const inCart = useCartStore((s) => s.lines[product.id]?.quantity ?? 0);
  const add = useCartStore((s) => s.add);
  const decrease = useCartStore((s) => s.decrease);
  const openCart = useCartStore((s) => s.open);

  const limit = Math.min(product.stockQuantity, product.maxPerOrder ?? Number.POSITIVE_INFINITY);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-pop backdrop-blur transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <ProductImage product={product} className="size-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block truncate text-sm">{product.name}</b>
          <span className="text-sm font-extrabold tabular-nums">{formatPrice(product.price)}</span>
        </div>

        {!product.inStock ? (
          <span className="rounded-full bg-surface-muted px-4 py-2 text-xs font-bold text-muted-foreground">Out of stock</span>
        ) : inCart > 0 ? (
          <div className="flex items-center gap-2">
            <QuantityStepper
              value={inCart}
              label={product.name}
              max={limit}
              onIncrease={() => add(product)}
              onDecrease={() => decrease(product.id)}
            />
            <Button size="icon" variant="ink" onClick={openCart} aria-label="Open cart">
              <LuShoppingCart size={18} />
            </Button>
          </div>
        ) : (
          <Button onClick={() => add(product)} tabIndex={visible ? 0 : -1}>
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductStickyBar;
