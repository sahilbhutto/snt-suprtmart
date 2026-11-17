import { LuCheck, LuLock } from "react-icons/lu";
import Badge from "../../../components/ui/Badge";
import FormField from "../../../components/ui/FormField";
import { cn } from "../../../lib/cn";
import { formatPrice } from "../../../lib/format";
import { paymentOptions } from "../data/checkout.data";
import type { CheckoutFormState } from "../hooks/useCheckoutForm";
import type { PaymentMethodId } from "../types/checkout.types";
import PaymentLogo, { MastercardMark, VisaMark } from "../components/PaymentLogo";
import PhoneInput from "./PhoneInput";

/* Brand colours for the selected row (full class names so Tailwind finds them) */
const theme: Record<PaymentMethodId, { border: string; tint: string; solid: string }> = {
  cod: { border: "border-success", tint: "bg-success-soft/50", solid: "bg-success text-background" },
  easypaisa: { border: "border-[#3BB44A]", tint: "bg-[#3BB44A]/10", solid: "bg-[#3BB44A] text-white" },
  jazzcash: { border: "border-[#ED1C24]", tint: "bg-[#ED1C24]/10", solid: "bg-[#ED1C24] text-white" },
  card: { border: "border-[#1A1F71] dark:border-[#7c83ff]", tint: "bg-[#1A1F71]/10", solid: "bg-[#1A1F71] text-white" },
};

const PaymentStep = ({ form, total }: { form: CheckoutFormState; total: number }) => {
  const { values, errors, bind, setValue } = form;
  const selected = paymentOptions.find((p) => p.id === values.paymentMethod) ?? paymentOptions[0];

  return (
    <div className="grid gap-4">
      <div role="radiogroup" aria-label="Payment method" className="grid gap-3">
        {paymentOptions.map((opt) => {
          const isSelected = opt.id === selected.id;
          const t = theme[opt.id];

          return (
            <div
              key={opt.id}
              className={cn(
                "overflow-hidden rounded-2xl border transition",
                isSelected ? cn("border-2", t.border, t.tint) : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <label className="flex cursor-pointer items-center gap-4 p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setValue("paymentMethod", opt.id)}
                  className="sr-only"
                />
                <PaymentLogo method={opt.id} />
                <span className="min-w-0 flex-1 leading-tight">
                  <b className="block text-base">{opt.label}</b>
                  <span className="text-sm text-muted-foreground">{opt.description}</span>
                </span>
                {opt.offer && <Badge tone="deal" className="hidden sm:inline-flex">{opt.offer}</Badge>}
                <span
                  aria-hidden
                  className={cn(
                    "grid size-6 shrink-0 aspect-square place-items-center rounded-full transition",
                    isSelected ? t.solid : "border-2 border-border-strong",
                  )}
                >
                  {isSelected && <LuCheck size={15} />}
                </span>
              </label>

              {isSelected && (
                <div className="animate-slide-up px-4 pb-5 sm:ps-[6.5rem]">
                  {opt.id === "cod" && (
                    <p className="text-sm leading-relaxed">
                      Please keep <b>{formatPrice(total)}</b> ready. Exact change helps the rider move faster. You pay only after your items arrive.
                    </p>
                  )}

                  {opt.requiresWallet && (
                    <div className="grid gap-4">
                      <FormField
                        id="field-walletNumber"
                        label={`${opt.label} mobile number`}
                        error={errors.walletNumber}
                        hint="We send the payment request to this number"
                      >
                        <PhoneInput {...bind("walletNumber")} hasError={!!errors.walletNumber} />
                      </FormField>

                      <ol className="grid gap-2.5 text-sm">
                        {["Review and confirm your order", `Approve the request in the ${opt.label} app`, "We start packing your items"].map((text, i) => (
                          <li key={text} className="flex items-center gap-3">
                            <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-extrabold", t.solid)}>{i + 1}</span>
                            {text}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {opt.id === "card" && (
                    <div className="grid gap-3 text-sm">
                      <p className="leading-relaxed">
                        After you confirm your order, you will be taken to our secure payment partner to enter your card details.
                      </p>
                      <div className="flex items-center gap-2">
                        <VisaMark className="h-8 w-14" />
                        <MastercardMark className="h-8 w-14" />
                        <span className="ms-1 text-xs text-muted-foreground">Bank transfer also accepted</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <LuLock size={14} /> We never store your card, PIN or wallet password.
      </p>
    </div>
  );
};

export default PaymentStep;
