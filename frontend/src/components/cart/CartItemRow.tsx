import { Link } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import type { CartLine } from '../../types/cart';
import { useCartStore } from '../../store/cartStore';
import ProductImage from '../product/ProductImage';
import QuantityStepper from '../ui/QuantityStepper';
import { formatPrice } from '../../lib/format';

const CartItemRow = ({ line }: { line: CartLine }) => {
  const { product, quantity } = line;
  const add = useCartStore((s) => s.add);
  const decrease = useCartStore((s) => s.decrease);
  const removeLine = useCartStore((s) => s.removeLine);
  const close = useCartStore((s) => s.close);

  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-surface p-2.5">
      <Link to={`/product/${product.slug}`} onClick={close} aria-label={product.name} className="shrink-0">
        <ProductImage product={product} className="size-20 rounded-xl sm:size-24" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/product/${product.slug}`} onClick={close} className="block truncate text-sm font-bold hover:text-link">
              {product.name}
            </Link>
            <span className="text-xs text-muted-foreground">{product.unit}</span>
          </div>
          <button
            type="button"
            onClick={() => removeLine(product.id)}
            aria-label={`Remove ${product.name}`}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-danger-soft hover:text-danger"
          >
            <LuTrash2 size={16} />
          </button>
        </div>

        <div className="flex items-end justify-between gap-2">
          <QuantityStepper
            value={quantity}
            label={product.name}
            onIncrease={() => add(product)}
            onDecrease={() => decrease(product.id)}
          />
          <div className="text-right leading-tight">
            <b className="block text-sm font-extrabold tabular-nums">{formatPrice(product.price * quantity)}</b>
            {product.oldPrice && (
              <s className="text-xs text-muted-foreground tabular-nums">{formatPrice(product.oldPrice * quantity)}</s>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItemRow;
