import { useState } from "react";
import type { RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuBadgeCheck,
  LuBell,
  LuCheck,
  LuHeart,
  LuShare2,
  LuShieldCheck,
  LuTruck,
  LuUndo2,
  LuWallet,
} from "react-icons/lu";
import type { ProductListItem } from "../types/products.types";
import { useCartStore } from "../../cart/store/cartStore";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "../../../lib/constants";
import RatingStars from "../../../components/ui/RatingStars";
import { formatCount, formatPrice } from "../../../lib/format";
import QuantityStepper from "../../../components/ui/QuantityStepper";
import Button from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";

const LOW_STOCK_AT = 10;

const trust = [
  { icon: LuShieldCheck, title: "Quality checked", text: "Before every dispatch" },
  { icon: LuUndo2, title: "Easy returns", text: "Report within 24 hours" },
  { icon: LuWallet, title: "Pay your way", text: "COD, Easypaisa, JazzCash" },
];

interface ProductBuyBoxProps {
  product: ProductListItem;
  /** Attached to the buy buttons so the phone bar knows when to show */
  ctaRef: RefObject<HTMLDivElement | null>;
  onSeeReviews: () => void;
}

const ProductBuyBox = ({ product, ctaRef, onSeeReviews }: ProductBuyBoxProps) => {
  const navigate = useNavigate();
  const inCart = useCartStore((s) => s.lines[product.id]?.quantity ?? 0);
  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.open);

  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false); // move to a wishlist store later
  const [notify, setNotify] = useState(false);
  const [shared, setShared] = useState(false);

  const limit = Math.min(product.stockQuantity, product.maxPerOrder ?? Number.POSITIVE_INFINITY);
  const remaining = Math.max(0, limit - inCart);
  const safeQty = Math.min(qty, Math.max(1, remaining));
  const stock = !product.inStock ? "out" : product.stockQuantity <= LOW_STOCK_AT ? "low" : "in";
  const saving = product.oldPrice ? product.oldPrice - product.price : 0;
  const freeDelivery = product.price * safeQty >= FREE_DELIVERY_THRESHOLD;

  const handleAdd = () => {
    add(product, safeQty);
    setQty(1);
    openCart();
  };

  const handleBuyNow = () => {
    add(product, safeQty);
    navigate("/checkout");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* the user closed the share sheet */
    }
  };

  return (
    <div className="grid content-start gap-5">
      {/* Title */}
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            to={`/products?brand=${product.brand.slug}`}
            className="font-bold text-link hover:underline"
          >
            {product.brand.name}
          </Link>
          <span aria-hidden className="text-muted-foreground">·</span>
          <Link to={`/category/${product.category.slug}`} className="text-muted-foreground hover:text-foreground hover:underline">
            {product.category.name}
          </Link>
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <button type="button" onClick={onSeeReviews} className="flex items-center gap-2 hover:underline">
            <RatingStars value={product.rating} />
            <b className="tabular-nums">{product.rating.toFixed(1)}</b>
            <span className="text-muted-foreground">({formatCount(product.ratingCount)} reviews)</span>
          </button>
          <span className="text-muted-foreground">{formatCount(product.sold)} sold</span>
          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-bold">{product.unit}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2 border-y border-border py-5">
        <b className="text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">{formatPrice(product.price)}</b>
        {product.oldPrice && (
          <>
            <s className="pb-1 text-lg text-muted-foreground tabular-nums">{formatPrice(product.oldPrice)}</s>
            <span className="mb-1 rounded-full bg-deal-soft px-3 py-1 text-xs font-bold text-deal">
              Save {product.discountPercent}% · {formatPrice(saving)}
            </span>
          </>
        )}
      </div>

      {/* Stock */}
      <p
        className={cn(
          "flex items-center gap-2 text-sm font-bold",
          stock === "in" && "text-success",
          stock === "low" && "text-deal",
          stock === "out" && "text-danger",
        )}
      >
        <span className="size-2 rounded-full bg-current" />
        {stock === "in" && "In stock"}
        {stock === "low" && `Only ${product.stockQuantity} left`}
        {stock === "out" && "Out of stock"}
        {product.maxPerOrder && stock !== "out" && (
          <span className="font-medium text-muted-foreground">· Limit {product.maxPerOrder} per order</span>
        )}
      </p>

      {/* Buy buttons */}
      <div ref={ctaRef} className="grid gap-3">
        {product.inStock ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper
                value={safeQty}
                label={product.name}
                min={1}
                max={Math.max(1, remaining)}
                onIncrease={() => setQty(Math.min(Math.max(1, remaining), safeQty + 1))}
                onDecrease={() => setQty(Math.max(1, safeQty - 1))}
              />
              <Button size="lg" onClick={handleAdd} disabled={remaining === 0} className="min-w-0 flex-1">
                {remaining === 0 ? "Maximum in cart" : `Add to cart · ${formatPrice(product.price * safeQty)}`}
              </Button>
            </div>
            {inCart > 0 && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <LuCheck size={14} /> {inCart} in your cart
              </p>
            )}
            <Button variant="ink" size="lg" onClick={handleBuyNow} disabled={remaining === 0}>
              Buy now
            </Button>
          </>
        ) : (
          <Button size="lg" variant={notify ? "secondary" : "primary"} onClick={() => setNotify((v) => !v)}>
            <LuBell size={18} />
            {notify ? "We will notify you" : "Notify me when available"}
          </Button>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-bold transition hover:border-border-strong"
          >
            <LuHeart size={16} className={saved ? "fill-deal text-deal" : ""} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-bold transition hover:border-border-strong"
          >
            {shared ? <LuCheck size={16} /> : <LuShare2 size={16} />}
            {shared ? "Link copied" : "Share"}
          </button>
        </div>
      </div>

      {/* Delivery */}
      <div className="grid gap-3 rounded-2xl border border-border bg-primary-soft p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-xl bg-surface text-link">
            <LuTruck size={18} />
          </span>
          <div className="leading-tight">
            <b className="block text-sm">Delivery in 2 hours</b>
            <span className="text-xs text-muted-foreground">
              {freeDelivery ? "Free delivery on this order" : `Free over ${formatPrice(FREE_DELIVERY_THRESHOLD)}, otherwise ${formatPrice(DELIVERY_FEE)}`}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-xl bg-surface text-link">
            <LuBadgeCheck size={18} />
          </span>
          <div className="leading-tight">
            <b className="block text-sm">Cash on delivery available</b>
            <span className="text-xs text-muted-foreground">Or pay online with Easypaisa, JazzCash and cards</span>
          </div>
        </div>
      </div>

      {/* Trust */}
      <ul className="grid grid-cols-3 gap-3">
        {trust.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.title} className="grid gap-1.5 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-full bg-surface-muted text-link">
                <Icon size={18} />
              </span>
              <b className="text-xs">{t.title}</b>
              <span className="text-[11px] text-muted-foreground">{t.text}</span>
            </li>
          );
        })}
      </ul>

      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Link
              key={tag}
              to={`/products?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:border-border-strong"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductBuyBox;
