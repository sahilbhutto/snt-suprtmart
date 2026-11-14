import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import type { ProductListItem } from "../types/products.types";

interface ProductShelfProps {
  title: string;
  products: ProductListItem[];
  actionLabel?: string;
  actionTo?: string;
}

const ProductShelf = ({ title, products, actionLabel, actionTo }: ProductShelfProps) => {
  if (products.length === 0) return null;

  return (
    <section aria-label={title} className="grid gap-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {actionLabel && actionTo && (
          <Link to={actionTo} className="shrink-0 text-sm font-bold text-link hover:underline">{actionLabel}</Link>
        )}
      </div>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <li key={p.id} className="w-44 shrink-0 snap-start sm:w-56">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductShelf;
