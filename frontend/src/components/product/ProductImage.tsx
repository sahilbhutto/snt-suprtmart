import { cn } from "../../lib/cn";
import { tintBg } from "../../lib/format";
import type { Product } from "../../types/catalog";

const ProductImage = ({ product, className }: { product: Product; className?: string }) => {

  return (
    <div className={cn('grid place-items-center overflow-hidden', tintBg[product.tint], className)}>
        <img src={product.image} alt={product.name} width={400} height={400} loading="lazy" className="size-full object-cover" />
    </div>
  );
};

export default ProductImage
