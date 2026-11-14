import { Link } from "react-router-dom";
import { LuBookmark, LuInfo, LuTrash2 } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import type { CartViewLine } from "../hooks/useCartView";
import { useCartStore } from "../store/cartStore";
import ProductImage from "../../products/components/ProductImage";
import { formatPrice } from "../../../lib/format";
import QuantityStepper from "../../../components/ui/QuantityStepper";

const LOW_STOCK_AT = 10;

const Notice = ({ tone, children }: { tone: "danger" | "warning" | "info"; children: React.ReactNode }) => (
  <p
    className={cn(
      "flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold",
      tone === "danger" && "bg-danger-soft text-danger",
      tone === "warning" && "bg-warning-soft text-warning",
      tone === "info" && "bg-info-soft text-info",
    )}
  >
    <LuInfo size={14} className="mt-px shrink-0" />
    <span>{children}</span>
  </p>
);

const CartPageItem = ({ line }: { line: CartViewLine }) => {
  const { product } = line;
  const add = useCartStore((s) => s.add);
  const decrease = useCartStore((s) => s.decrease);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const saveForLater = useCartStore((s) => s.saveForLater);

  const lowStock = !line.unavailable && !line.overStock && product.stockQuantity <= LOW_STOCK_AT;

  return (
    <li className="grid gap-4 rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="flex gap-4">
        <Link to={`/product/${product.slug}`} aria-label={product.name} className="shrink-0">
          <ProductImage
            product={product}
            className={cn("size-24 rounded-2xl sm:size-28", line.unavailable && "opacity-50 grayscale")}
          />
        </Link>

        <div className="grid min-w-0 flex-1 content-start gap-1">
          <Link to={`/product/${product.slug}`} className="text-base font-bold leading-snug hover:text-link">
            {product.name}
          </Link>
          <span className="w-max rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold">{product.unit}</span>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
            <b className="tabular-nums">{formatPrice(product.price)}</b>
            {product.oldPrice && (
              <s className="text-xs text-muted-foreground tabular-nums">{formatPrice(product.oldPrice)}</s>
            )}
            <span className="text-xs text-muted-foreground">each</span>
          </div>
        </div>

        <div className="text-end">
          <b className={cn("block text-lg font-extrabold tabular-nums sm:text-xl", line.unavailable && "text-muted-foreground line-through")}>
            {formatPrice(product.price * line.quantity)}
          </b>
          {line.lineSavings > 0 && (
            <span className="text-xs font-semibold text-success">Save {formatPrice(line.lineSavings)}</span>
          )}
        </div>
      </div>

      {line.unavailable && (
        <Notice tone="danger">This item is no longer available. Remove it or save it for later to continue.</Notice>
      )}
      {line.overStock && (
        <Notice tone="warning">
          Only {line.maxQuantity} available right now.{" "}
          <button type="button" onClick={() => setQuantity(line.id, line.maxQuantity)} className="font-bold underline">
            Update to {line.maxQuantity}
          </button>
        </Notice>
      )}
      {lowStock && <Notice tone="warning">Only {product.stockQuantity} left in stock. Order soon.</Notice>}
      {!line.unavailable && line.priceChange !== 0 && (
        <Notice tone="info">
          {line.priceChange < 0 ? "Good news, the price dropped" : "The price changed"} by {formatPrice(Math.abs(line.priceChange))} since you added this item.
        </Notice>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        {line.unavailable ? (
          <span className="text-sm font-bold text-danger">Unavailable</span>
        ) : (
          <QuantityStepper
            value={line.quantity}
            label={product.name}
            min={1}
            max={line.maxQuantity}
            onIncrease={() => add(product)}
            onDecrease={() => decrease(line.id)}
          />
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => saveForLater(line.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
          >
            <LuBookmark size={15} /> Save for later
          </button>
          <button
            type="button"
            onClick={() => removeLine(line.id)}
            aria-label={`Remove ${product.name}`}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-danger-soft hover:text-danger"
          >
            <LuTrash2 size={15} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartPageItem;
