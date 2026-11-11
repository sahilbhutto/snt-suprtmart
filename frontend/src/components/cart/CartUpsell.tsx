import { LuPlus } from 'react-icons/lu';
import { useCartStore } from '../../store/cartStore';
import { products } from '../../data/home.data';
import ProductImage from '../product/ProductImage';
import { formatPrice } from '../../lib/format';

const CartUpsell = () => {
  const lines = useCartStore((s) => s.lines);
  const add = useCartStore((s) => s.add);

  const suggestions = [...products]
    .filter((p) => !lines[p.id])
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6);

  if (suggestions.length === 0) return null;

  return (
    <section aria-label="Complete your basket" className="grid gap-3">
      <h3 className="text-sm font-bold">Complete your basket</h3>
      <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        {suggestions.map((p) => (
          <li key={p.id} className="w-36 shrink-0 snap-start rounded-2xl border border-border bg-surface p-2">
            <ProductImage product={p} className="h-20 rounded-xl" />
            <b className="mt-2 block truncate text-xs">{p.name}</b>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-extrabold tabular-nums">{formatPrice(p.price)}</span>
              <button
                type="button"
                onClick={() => add(p)}
                aria-label={`Add ${p.name}`}
                className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110"
              >
                <LuPlus size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CartUpsell;
