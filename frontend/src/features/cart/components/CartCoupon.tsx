import { useState } from "react";
import type { FormEvent } from "react";
import { LuCheck, LuTag, LuX } from "react-icons/lu";
import { useCartStore } from "../store/cartStore";
import { COUPONS } from "../../../lib/constants";
import { formatPrice } from "../../../lib/format";
import { cn } from "../../../lib/cn";
import Button from "../../../components/ui/Button";

type Message = { type: "error" | "success"; text: string } | null;

const CartCoupon = ({ subtotal }: { subtotal: number }) => {
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState<Message>(null);

  const tryApply = (value: string) => {
    const result = applyCoupon(value);
    if (result === "applied") {
      setMessage({ type: "success", text: "Coupon applied" });
      setCode("");
    } else if (result === "minimum") {
      const rule = COUPONS[value.trim().toUpperCase()];
      setMessage({ type: "error", text: `Add ${formatPrice(Math.max(0, (rule?.minSubtotal ?? 0) - subtotal))} more to use this code` });
    } else {
      setMessage({ type: "error", text: "This code is not valid" });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim()) tryApply(code);
  };

  const rule = coupon ? COUPONS[coupon] : undefined;
  const inactive = !!rule && subtotal < rule.minSubtotal;

  return (
    <div className="grid gap-3">
      <b className="flex items-center gap-2 text-sm"><LuTag size={16} className="text-link" /> Coupon</b>

      {coupon ? (
        <div className={cn("flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm", inactive ? "bg-warning-soft" : "bg-success-soft")}>
          <span className="min-w-0">
            <b className={inactive ? "text-warning" : "text-success"}>{coupon}</b>
            <span className="block text-xs text-muted-foreground">
              {inactive ? `Add ${formatPrice(rule.minSubtotal - subtotal)} more to use it` : rule?.label}
            </span>
          </span>
          <button type="button" onClick={removeCoupon} aria-label="Remove coupon" className="grid size-8 shrink-0 aspect-square place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-danger">
            <LuX size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-1.5">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setMessage(null);
              }}
              aria-label="Coupon code"
              placeholder="Enter code"
              className="min-h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-subtle-foreground focus:border-primary"
            />
            <Button type="submit" variant="secondary">Apply</Button>
          </div>
          {message && (
            <p aria-live="polite" className={cn("px-1 text-xs", message.type === "error" ? "text-danger" : "text-success")}>{message.text}</p>
          )}
        </form>
      )}

      {/* Offers the customer can tap */}
      {!coupon && (
        <ul className="grid gap-2">
          {Object.entries(COUPONS).map(([key, offer]) => {
            const eligible = subtotal >= offer.minSubtotal;
            return (
              <li key={key} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-border-strong px-3.5 py-2.5">
                <span className="min-w-0 leading-tight">
                  <b className="text-sm tracking-wide">{key}</b>
                  <span className="block truncate text-xs text-muted-foreground">{offer.label}</span>
                </span>
                {eligible ? (
                  <button type="button" onClick={() => tryApply(key)} className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition hover:brightness-110">
                    Apply
                  </button>
                ) : (
                  <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">Add {formatPrice(offer.minSubtotal - subtotal)}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {coupon && !inactive && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-success"><LuCheck size={14} /> Discount added to your total</p>
      )}
    </div>
  );
};

export default CartCoupon;
