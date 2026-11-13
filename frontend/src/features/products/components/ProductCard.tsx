import { useState } from "react";
import { Link } from "react-router-dom";
import { LuHeart, LuMinus, LuPlus, LuStar } from "react-icons/lu";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import ProgressBar from "../../../components/ui/ProgressBar";
import ProductImage from "./ProductImage";
import { formatCount, formatPrice } from "../../../lib/format";
import { getProductBadge } from "../lib/product";
import { useCartStore } from "../../cart/store/cartStore";
import type { ProductListItem } from "../types/products.types";

interface ProductCardProps {
  product: ProductListItem;
  soldPercent?: number;
}

const ProductCard = ({ product, soldPercent }: ProductCardProps) => {
  const quantity = useCartStore((s) => s.lines[product.id]?.quantity ?? 0);
  const add = useCartStore((s) => s.add);
  const decrease = useCartStore((s) => s.decrease);
  const [saved, setSaved] = useState(false);

  const badge = getProductBadge(product);
  const canAdd = product.inStock;
  const atLimit =
    product.maxPerOrder !== undefined && quantity >= product.maxPerOrder;

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-foreground shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-pop">
      <div className="relative">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <ProductImage
            product={product}
            className={`h-36 rounded-xl ${canAdd ? "" : "opacity-60 grayscale"}`}
          />
        </Link>
        {badge && (
          <Badge
            tone={canAdd ? "deal" : "neutral"}
            className="absolute left-3 top-3"
          >
            {badge}
          </Badge>
        )}
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-surface/90 text-muted-foreground shadow-sm transition hover:text-primary"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <LuHeart
            size={18}
            className={saved ? "fill-primary text-primary" : ""}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">{product.brand.name}</p>
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.unit}</p>

        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <LuStar size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({formatCount(product.ratingCount)})
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold">{formatPrice(product.price)}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {typeof soldPercent === "number" && (
          <div className="grid gap-1">
            <ProgressBar value={soldPercent} />
            <p className="text-[11px] text-muted-foreground">
              {soldPercent}% sold
            </p>
          </div>
        )}

        {quantity === 0 ? (
          <Button
            size="sm"
            disabled={!canAdd || atLimit}
            onClick={() => canAdd && add(product)}
            className="mt-1 w-full"
          >
            {canAdd ? "Add to cart" : "Out of stock"}
          </Button>
        ) : (
          <div className="mt-1 flex items-center justify-between gap-2 rounded-full border border-border bg-surface px-1 py-1">
            <button
              type="button"
              onClick={() => decrease(product.id)}
              className="grid size-8 place-items-center rounded-full hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <LuMinus size={16} />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => !atLimit && add(product)}
              disabled={atLimit}
              className="grid size-8 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <LuPlus size={16} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
