import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import ProductImage from "./ProductImage";
import type { ProductListItem } from "../types/products.types";
import { getProductBadge } from "../lib/product";
import { cn } from "../../../lib/cn";
import ImageWithFallback from "../../../components/ui/ImageFallback";
import Badge from "../../../components/ui/Badge";

const ProductGallery = ({ product }: { product: ProductListItem }) => {
  const [zoom, setZoom] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const badge = getProductBadge(product);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      ref={frameRef}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMove}
      className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
    >
      <div
        className={cn("size-full transition-transform duration-200 ease-out", zoom && "md:scale-[1.9]")}
        style={{ transformOrigin: "var(--zx, 50%) var(--zy, 50%)" }}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          fallback={<ProductImage product={product} className="size-full" />}
        />
      </div>

      {badge && (
        <Badge tone={product.inStock ? "deal" : "neutral"} className="absolute start-4 top-4 px-3 py-1.5 text-xs">
          {badge}
        </Badge>
      )}
    </div>
  );
};

export default ProductGallery;
