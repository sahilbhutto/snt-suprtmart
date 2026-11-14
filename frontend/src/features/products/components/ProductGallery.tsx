import { useRef, useState } from "react";
import type { MouseEvent, TouchEvent } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ProductImage from "./ProductImage";
import type { ProductListItem } from "../types/products.types";
import { getProductBadge } from "../lib/product";
import { cn } from "../../../lib/cn";
import ImageWithFallback from "../../../components/ui/ImageFallback";
import Badge from "../../../components/ui/Badge";

const arrow =
  "absolute top-1/2 hidden size-11 shrink-0 aspect-square -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/90 text-foreground shadow-card backdrop-blur transition hover:bg-surface md:grid";

const ProductGallery = ({ product }: { product: ProductListItem }) => {
  const image = product.image;
  const total = Math.max(image.length, 1);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const badge = getProductBadge(product);
  const go = (i: number) => setIndex((i + total) % total);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (delta < -50) go(index + 1);
    if (delta > 50) go(index - 1);
    touchX.current = null;
  };

  return (
    <div className="grid gap-3">
      <div
        ref={frameRef}
        onMouseEnter={() => image.length > 0 && setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMove}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
      >
        <div
          className={cn("size-full transition-transform duration-200 ease-out", zoom && "md:scale-[1.9]")}
          style={{ transformOrigin: "var(--zx, 50%) var(--zy, 50%)" }}
        >
          {image.length === 0 ? (
            <ProductImage product={product} className="size-full" />
          ) : (
            <ImageWithFallback
              key={product.id}
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              fallback={<ProductImage product={product} className="size-full" />}
            />
          )}
        </div>

        {badge && (
          <Badge tone={product.inStock ? "deal" : "neutral"} className="absolute start-4 top-4 px-3 py-1.5 text-xs">
            {badge}
          </Badge>
        )}

      </div>
    </div>
  );
};

export default ProductGallery;
