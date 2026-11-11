import { useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import Badge from "../ui/Badge";
import { LuHeart, LuMinus, LuPlus, LuStar } from "react-icons/lu";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import type { ProductCardProps } from "../../types/catalog";
import { formatCount, formatPrice } from "../../lib/format";
import { useCartStore } from "../../store/cartStore";

const ProductCard = ({ product, showProgress }: ProductCardProps) => {
  const quantity = useCartStore((s) => s.lines[product.id]?.quantity ?? 0);
  const add = useCartStore((s) => s.add);
  const decrease = useCartStore((s) => s.decrease);
  const [saved, setSaved] = useState(false);

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-foreground shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-pop">
      <div className="relative">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <ProductImage product={product} className="h-36 rounded-xl" />
        </Link>
        {product.badge && (
          <Badge tone="deal" className="absolute left-3 top-3">
            {product.badge}
          </Badge>
        )}
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-muted"
        >
          <LuHeart size={16} className={saved ? "fill-deal text-deal" : ""} />
        </button>
      </div>

      <Link
        to={`/product/${product.slug}`}
        className="text-sm font-bold hover:text-link"
      >
        {product.name}
      </Link>
      <span className="text-xs text-muted-foreground">{product.unit}</span>

      <span className="flex items-center gap-1 text-xs">
        <LuStar size={14} className="fill-amber-500 text-amber-500" />
        <b>{product.rating.toFixed(1)}</b>
        <span className="text-muted-foreground">
          · {formatCount(product.sold)} sold
        </span>
      </span>

      {showProgress && product.soldPercent !== undefined && (
        <ProgressBar
          value={product.soldPercent}
          label={`${product.soldPercent}% sold`}
        />
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="leading-tight">
          <b className="text-base font-extrabold tabular-nums">
            {formatPrice(product.price)}
          </b>
          {product.oldPrice && (
            <s className="ml-1.5 text-xs text-muted-foreground tabular-nums">
              {formatCount(product.oldPrice)}
            </s>
          )}
        </div>

        {quantity > 0 ? (
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => decrease(product.id)}
              aria-label={`Decrease ${product.name}`}
              className="grid size-8 place-items-center rounded-full bg-surface"
            >
              <LuMinus size={14} />
            </button>
            <b className="w-5 text-center text-sm tabular-nums">{quantity}</b>
            <button
              type="button"
              onClick={() => add(product)}
              aria-label={`Increase ${product.name}`}
              className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <LuPlus size={14} />
            </button>
          </div>
        ) : (
          <Button
            size="icon"
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <LuPlus />
          </Button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
