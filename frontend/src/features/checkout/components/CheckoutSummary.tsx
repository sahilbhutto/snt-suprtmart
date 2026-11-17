import { formatPrice } from "../../../lib/format";
import CartCoupon from "../../cart/components/CartCoupon";
import type { CartView } from "../../cart/hooks/useCartView";
import { useCartStore } from "../../cart/store/cartStore";
import ProductImage from "../../products/components/ProductImage";

const Row = ({ label, value, tone }: { label: string; value: string; tone?: "success" }) => (
  <div className={`flex items-center justify-between text-sm ${tone === "success" ? "text-success" : ""}`}>
    <dt className={tone === "success" ? "" : "text-muted-foreground"}>{label}</dt>
    <dd className="font-semibold tabular-nums">{value}</dd>
  </div>
);

const CheckoutSummary = ({ view }: { view: CartView }) => {
  const coupon = useCartStore((s) => s.coupon);
  const { lines, summary, count } = view;
  const items = lines.filter((l) => !l.unavailable);

  return (
    <div className="grid gap-5">
      <ul aria-label="Items in your order" className="grid max-h-72 gap-3 overflow-y-auto pe-1">
        {items.map((l) => (
          <li key={l.id} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <ProductImage product={l.product} className="size-14 rounded-xl" />
              <span className="absolute -end-2 -top-2 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-ink-foreground">
                {Math.min(l.quantity, l.maxQuantity)}
              </span>
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <b className="block truncate text-sm">{l.product.name}</b>
              <span className="text-xs text-muted-foreground">{l.product.unit}</span>
            </div>
            <b className="text-sm tabular-nums">{formatPrice(l.lineTotal)}</b>
          </li>
        ))}
      </ul>

      <CartCoupon subtotal={summary.subtotal} />

      <dl className="grid gap-3 border-t border-border pt-5">
        <Row label={`Subtotal (${count} ${count === 1 ? "item" : "items"})`} value={formatPrice(summary.subtotal)} />
        <Row label="Delivery" value={summary.delivery === 0 ? "Free" : formatPrice(summary.delivery)} />
        {summary.discount > 0 && <Row label={`Coupon ${coupon}`} value={`- ${formatPrice(summary.discount)}`} tone="success" />}
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <dt className="font-bold">Total</dt>
          <dd className="text-2xl font-extrabold tabular-nums">{formatPrice(summary.total)}</dd>
        </div>
        <p className="-mt-1 text-xs text-muted-foreground">Taxes included.</p>
      </dl>

      {summary.savings > 0 && (
        <p className="rounded-xl bg-success-soft px-3.5 py-2.5 text-center text-xs font-bold text-success">
          You are saving {formatPrice(summary.savings)} on this order
        </p>
      )}
    </div>
  );
};

export default CheckoutSummary;
