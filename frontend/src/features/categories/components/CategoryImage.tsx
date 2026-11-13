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
  const Icon = category.icon ?? style.icon;
  const tint = style.tint;

  // support both string URL and { url, alt }
  const imageUrl =
    typeof category.image === "string"
      ? category.image
      : category?.image;

  return (
    <div
      className={cn(
        "grid aspect-square place-items-center overflow-hidden",
        tintBg[tint],
        className,
      )}
    >
      <ImageWithFallback
        src={imageUrl}
        alt={category.name}
        width={300}
        height={300}
        fallback={<Icon className="size-1/3 text-foreground/70" aria-hidden />}
      />
    </div>
  );
};

export default CategoryImage;
