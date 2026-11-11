import { cn } from "../../lib/cn";
import { tintBg } from "../../lib/format";
import type { Category } from "../../types/catalog";
import ImageWithFallback from "../ui/ImageFallback";

const CategoryImage = ({ category, className }: { category: Category; className?: string }) => {
  const Icon = category.icon;

  return (
    <div className={cn('grid aspect-square place-items-center overflow-hidden', tintBg[category.tint], className)}>
      <ImageWithFallback
        src={category.image}
        alt={category.name}
        width={300}
        height={300}
        fallback={<Icon className="size-1/3 text-foreground/70" aria-hidden />}
      />
    </div>
  );
};

export default CategoryImage
