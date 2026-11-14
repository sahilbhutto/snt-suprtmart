import { LuLock, LuTruck, LuUndo2 } from "react-icons/lu";
import type { CartSummary } from "../lib/cart";
import { useCartStore } from "../store/cartStore";
import CartCoupon from "./CartCoupon";
import { formatPrice } from "../../../lib/format";
import Button from "../../../components/ui/Button";
import { paymentMethods } from "../../home/data/layout.data";

interface CartOrderSummaryProps {
  summary: CartSummary;
  itemCount: number;
  canCheckout: boolean;
  blockedMessage?: string;
}

const Row = ({ label, value, tone }: { label: string; value: string; tone?: "success" }) => (
  <div className={`flex items-center justify-between text-sm ${tone === "success" ? "text-success" : ""}`}>
    <dt className={tone === "success" ? "" : "text-muted-foreground"}>{label}</dt>
    <dd className="font-semibold tabular-nums">{value}</dd>
  </div>
);

const CartOrderSummary = ({ summary, itemCount, canCheckout, blockedMessage }: CartOrderSummaryProps) => {
  const coupon = useCartStore((s) => s.coupon);

  return (
    <aside aria-label="Order summary" className="grid gap-5 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-xl font-bold">Order summary</h2>

      <CartCoupon subtotal={summary.subtotal} />

      <dl className="grid gap-3 border-t border-border pt-5">
        <Row label={`Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})`} value={formatPrice(summary.subtotal)} />
        <Row label="Delivery" value={summary.delivery === 0 ? "Free" : formatPrice(summary.delivery)} />
        {summary.discount > 0 && <Row label={`Coupon ${coupon}`} value={`- ${formatPrice(summary.discount)}`} tone="success" />}
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <dt className="font-bold">Total</dt>
          <dd className="text-2xl font-extrabold tabular-nums">{formatPrice(summary.total)}</dd>
        </div>
        <p className="-mt-1 text-xs text-muted-foreground">Taxes included. Cash on delivery available.</p>
      </dl>

      {summary.savings > 0 && (
        <p className="rounded-xl bg-success-soft px-3.5 py-2.5 text-center text-xs font-bold text-success">
          You are saving {formatPrice(summary.savings)} on this order
        </p>
      )}

      {canCheckout ? (
        <Button to="/checkout" size="lg" className="w-full">
          Proceed to checkout · {formatPrice(summary.total)}
        </Button>
      ) : (
        <div className="grid gap-2">
          <Button size="lg" disabled className="w-full">Proceed to checkout</Button>
          {blockedMessage && <p className="text-center text-xs font-semibold text-danger">{blockedMessage}</p>}
        </div>
      )}

      <ul className="grid gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
        <li className="flex items-center gap-2.5"><LuTruck size={16} className="text-link" /> Delivery in about 2 hours</li>
        <li className="flex items-center gap-2.5"><LuUndo2 size={16} className="text-link" /> Report any issue within 24 hours</li>
        <li className="flex items-center gap-2.5"><LuLock size={16} className="text-link" /> Secure checkout</li>
      </ul>

      <div className="flex flex-wrap gap-2">
        {paymentMethods.map((m) => (
          <span key={m} className="rounded-md border border-border px-2.5 py-1 text-[11px] font-bold">{m}</span>
        ))}
      </div>
    </aside>
  );
};

export default CartOrderSummary;
