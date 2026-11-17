import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import ProductImage from "../../products/components/ProductImage";
import { formatPrice } from "../../../lib/format";

const SavedForLater = () => {
  const saved = useCartStore((s) => s.saved);
  const moveToCart = useCartStore((s) => s.moveToCart);
  const removeSaved = useCartStore((s) => s.removeSaved);

  const items = Object.values(saved);
  if (items.length === 0) return null;

  return (
    <section aria-label="Saved for later" className="grid gap-4">
      <h2 className="text-2xl font-bold tracking-tight">
        Saved for later <span className="text-base font-semibold text-muted-foreground">({items.length})</span>
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <li key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 shadow-card">
            <Link to={`/product/${p.slug}`} aria-label={p.name} className="shrink-0">
              <ProductImage product={p} className="size-20 rounded-xl" />
            </Link>
            <div className="grid min-w-0 flex-1 gap-1">
              <Link to={`/product/${p.slug}`} className="truncate text-sm font-bold hover:text-link">{p.name}</Link>
              <span className="text-xs text-muted-foreground">{p.unit} · <b className="text-foreground tabular-nums">{formatPrice(p.price)}</b></span>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => moveToCart(p.id)}
                  disabled={!p.inStock}
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
                >
                  {p.inStock ? "Move to cart" : "Out of stock"}
                </button>
                <button type="button" onClick={() => removeSaved(p.id)} className="rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:bg-surface-muted hover:text-danger">
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SavedForLater;
