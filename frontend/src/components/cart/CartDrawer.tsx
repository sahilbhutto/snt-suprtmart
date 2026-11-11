import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { LuLock, LuShoppingBag, LuTag, LuX } from 'react-icons/lu';
import { useCartStore, useCartSummary } from '../../store/cartStore';
import { COUPONS } from '../../lib/constants';
import { formatPrice } from '../../lib/format';
import { cn } from '../../lib/cn';
import { categories } from '../../data/home.data';
import Button from '../ui/Button';
import FreeDeliveryProgress from './FreeDeliveryProgress';
import CartItemRow from './CartItemRow';
import CartUpsell from './CartUpsell';

const payments = ['COD', 'Easypaisa', 'JazzCash', 'Visa'];

type Message = { type: 'error' | 'success'; text: string } | null;

const CartDrawer = () => {
  const open = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const clear = useCartStore((s) => s.clear);
  const summary = useCartSummary();

  const items = Object.values(lines);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<Message>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll, close on Escape, focus the close button
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const handleApply = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const result = applyCoupon(code);
    if (result === 'applied') {
      setMessage({ type: 'success', text: 'Coupon applied' });
      setCode('');
    } else if (result === 'minimum') {
      const rule = COUPONS[code.trim().toUpperCase()];
      const need = rule ? rule.minSubtotal - summary.subtotal : 0;
      setMessage({ type: 'error', text: `Add ${formatPrice(need)} more to use this code` });
    } else {
      setMessage({ type: 'error', text: 'This code is not valid' });
    }
  };

  return createPortal(
    <div
      className={cn('fixed inset-0 z-[60] transition-[visibility] duration-300', open ? 'visible' : 'invisible')}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close cart"
        onClick={close}
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full flex-col overflow-hidden bg-background shadow-pop transition-transform duration-300 ease-out sm:max-w-[440px] sm:rounded-l-3xl',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-accent">
              <LuShoppingBag size={20} />
            </span>
            <div className="leading-tight">
              <h2 className="text-lg font-bold">Your cart</h2>
              <p className="text-xs text-muted-foreground">
                {summary.count} {summary.count === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button type="button" onClick={clear} className="text-xs font-semibold text-muted-foreground transition hover:text-danger">
                Clear all
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close cart"
              className="grid size-10 place-items-center rounded-full border border-border bg-surface transition hover:bg-surface-muted"
            >
              <LuX size={18} />
            </button>
          </div>
        </header>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid size-24 place-items-center rounded-3xl bg-tint-1 text-foreground/70">
              <LuShoppingBag size={44} />
            </span>
            <div className="grid gap-1.5">
              <h3 className="text-xl font-bold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Add groceries and we will deliver in 2 hours.</p>
            </div>
            <Button to="/products" onClick={close}>Start shopping</Button>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  onClick={close}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold transition hover:border-border-strong"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <FreeDeliveryProgress summary={summary} />
              <ul className="grid gap-3">
                {items.map((line) => (
                  <CartItemRow key={line.product.id} line={line} />
                ))}
              </ul>
              <CartUpsell />
            </div>

            {/* Sticky footer */}
            <footer className="grid gap-4 border-t border-border bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              {/* Coupon */}
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl bg-success-soft px-3.5 py-2.5 text-sm">
                  <span className="flex items-center gap-2 font-bold text-success">
                    <LuTag size={16} /> {coupon} applied
                  </span>
                  <button type="button" onClick={removeCoupon} className="text-xs font-semibold text-muted-foreground hover:text-danger">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="grid gap-1.5">
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setMessage(null);
                      }}
                      aria-label="Coupon code"
                      placeholder="Coupon code"
                      className="min-h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm uppercase outline-none placeholder:normal-case placeholder:text-subtle-foreground focus:border-primary"
                    />
                    <Button type="submit" variant="secondary">Apply</Button>
                  </div>
                  {message && (
                    <p className={cn('px-1 text-xs', message.type === 'error' ? 'text-danger' : 'text-success')}>{message.text}</p>
                  )}
                </form>
              )}

              {/* Summary */}
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(summary.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">{summary.delivery === 0 ? 'Free' : formatPrice(summary.delivery)}</dd>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>Coupon {coupon}</dt>
                    <dd className="tabular-nums">- {formatPrice(summary.discount)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-border pt-3">
                  <dt className="font-bold">Total</dt>
                  <dd className="text-xl font-extrabold tabular-nums">{formatPrice(summary.total)}</dd>
                </div>
              </dl>

              {summary.savings > 0 && (
                <p className="rounded-xl bg-success-soft px-3.5 py-2 text-center text-xs font-bold text-success">
                  You are saving {formatPrice(summary.savings)} on this order
                </p>
              )}

              <Button to="/checkout" size="lg" onClick={close} className="w-full">
                Checkout · {formatPrice(summary.total)}
              </Button>
              <Button to="/cart" variant="secondary" onClick={close} className="w-full">
                View full cart
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <LuLock size={12} />
                <span>Secure checkout</span>
                {payments.map((p) => (
                  <span key={p} className="rounded-md border border-border px-2 py-0.5 font-bold">{p}</span>
                ))}
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
};

export default CartDrawer;
