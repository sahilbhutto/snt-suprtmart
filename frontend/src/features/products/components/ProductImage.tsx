import { LuPackage } from "react-icons/lu";
import { getCollectionStyle } from "../../catalog/category.ui";
import { categories } from "../../categories/data/categories.data";
import { cn } from "../../../lib/cn";
import { tintBg } from "../../../lib/format";
import type { ProductListItem } from "../types/products.types";
import ImageWithFallback from "../../../components/ui/ImageFallback";

const categoriesById = new Map(categories.map((c) => [c.id, c]));

interface ProductImageProps {
  product: ProductListItem;
  className?: string;
}

const ProductImage = ({ product, className }: ProductImageProps) => {
  const category = categoriesById.get(product.categoryId);
  const { icon: Icon, tint } = category
    ? getCollectionStyle(category.collectionSlug)
    : { icon: LuPackage, tint: 2 as const };

  return (
    <div className={cn("grid place-items-center overflow-hidden", tintBg[tint], className)}>
      <ImageWithFallback
        src={product.image}
        alt={product.name}
        width={400}
        height={400}
        fallback={<Icon className="size-16 text-foreground/70" aria-hidden />}
      />
    </div>
  );
};

export default ProductImage;
