
import { LuShoppingBasket } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import { tintBg } from "../../../lib/format";
import { getCollectionStyle } from "../../catalog/category.ui";
import type { Category } from "../types/categories.types";
import ImageWithFallback from "../../../components/ui/ImageFallback";

const CategoryImage = ({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) => {
  const style = getCollectionStyle(category.collectionSlug);
  const tint = style.tint;

  const imageUrl =
    typeof category.image === "string" && category.image.trim()
      ? category.image
      : null;

  return (
    <div
      className={cn(
        "grid aspect-square place-items-center overflow-hidden",
        tintBg[tint],
        className,
      )}
    >
      {imageUrl ? (
        <ImageWithFallback
          src={imageUrl}
          alt={category.name}
          width={300}
          height={300}
          fallback={<LuShoppingBasket className="size-1/3 text-foreground/70" />}
        />
      ) : (
        <LuShoppingBasket
          aria-label={category.name}
          className="size-1/3 text-foreground/70"
        />
      )}
    </div>
  );
};

export default CategoryImage;
