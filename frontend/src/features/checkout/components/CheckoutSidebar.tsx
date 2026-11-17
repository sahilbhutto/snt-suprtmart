import { Link } from "react-router-dom";
import { LuShieldCheck, LuTruck } from "react-icons/lu";
import { paymentMethods } from "../../../data/layout.data";
import { cn } from "../../../lib/cn";
import type { CartView } from "../../cart/hooks/useCartView";
import { deliveryPromise } from "../lib/eta";
import CheckoutSummary from "./CheckoutSummary";
import PlaceOrderButton from "./PlaceOrderButton";

interface CheckoutSidebarProps {
  view: CartView;
  review: boolean;
  agreed: boolean;
  onAgreeChange: (value: boolean) => void;
  submitting: boolean;
  canPlace: boolean;
}

const CheckoutSidebar = ({ view, review, agreed, onAgreeChange, submitting, canPlace }: CheckoutSidebarProps) => (
  <aside
    aria-label="Order summary"
    className={cn("gap-5 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6 lg:sticky lg:top-24", review ? "grid" : "hidden lg:grid")}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{review ? "Your items" : "Order summary"}</h2>
      <Link to="/cart" className="text-sm font-bold text-link hover:underline">Edit cart</Link>
    </div>

    <CheckoutSummary view={view} />

    {review ? (
      <div className="grid gap-4 border-t border-border pt-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={agreed} onChange={(e) => onAgreeChange(e.target.checked)} className="mt-0.5 size-4 accent-primary" />
          <span>
            I agree to the <Link to="/legal/terms" className="font-bold text-link hover:underline">Terms</Link> and{" "}
            <Link to="/legal/refunds" className="font-bold text-link hover:underline">Refund policy</Link>
          </span>
        </label>

        <PlaceOrderButton total={view.summary.total} submitting={submitting} disabled={!canPlace || !agreed} className="min-h-14 w-full text-base" />
        <p className="text-center text-xs text-muted-foreground">You pay only after we confirm your order.</p>
      </div>
    ) : (
      <ul className="grid gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2.5"><LuTruck size={16} className="text-link" /> Delivery {deliveryPromise()}</li>
        <li className="flex items-center gap-2.5"><LuShieldCheck size={16} className="text-link" /> Secure, encrypted checkout</li>
      </ul>
    )}

    <div className="flex flex-wrap gap-2">
      {paymentMethods.map((m) => (
        <span key={m} className="rounded-md border border-border px-2.5 py-1 text-[11px] font-bold">{m}</span>
      ))}
    </div>
  </aside>
);

export default CheckoutSidebar;
