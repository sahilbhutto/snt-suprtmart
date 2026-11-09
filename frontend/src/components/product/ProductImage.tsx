import { tintBg } from "../../data/home.data";
import { cn } from "../../lib/cn";
import type { Product } from "../../types/catalog";

const ProductImage = ({ product, className }: { product: Product; className?: string }) => {
  const Icon = product.icon;

  return (
    <div className={cn('grid place-items-center overflow-hidden', tintBg[product.tint], className)}>
      {product.image ? (
        <img src={product.image} alt={product.name} width={400} height={400} loading="lazy" className="size-full object-cover" />
      ) : (
        <Icon className="size-16 text-foreground/70" aria-hidden />
      )}
    </div>
  );
};

export default ProductImage
