import type { ReactNode } from "react";
import { LuCheck, LuPencil, LuTruck } from "react-icons/lu";
import { paymentOptions } from "../data/checkout.data";
import { SERVICE_CITY, SERVICE_PROVINCE } from "../data/checkout.data";
import type { CheckoutFormState } from "../hooks/useCheckoutForm";
import { arriveBy, deliveryPromise } from "../lib/eta";
import { normalizePhone } from "../lib/validation";
import type { StepId } from "../types/checkout.types";
import PaymentLogo from "../components/PaymentLogo";

const ReviewCard = ({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) => (
  <section className="grid gap-3 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6">
    <div className="flex items-center gap-4">
      <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-full bg-success text-background">
        <LuCheck size={20} />
      </span>
      <h3 className="flex-1 text-lg font-bold">{title}</h3>
      {onEdit && (
        <button type="button" onClick={onEdit} className="flex items-center gap-1.5 text-sm font-bold text-link hover:underline">
          <LuPencil size={14} /> Edit
        </button>
      )}
    </div>
    <div className="text-[15px] leading-relaxed sm:ps-14">{children}</div>
  </section>
);

const ReviewPanel = ({ form }: { form: CheckoutFormState }) => {
  const { values, edit } = form;
  const method = paymentOptions.find((p) => p.id === values.paymentMethod) ?? paymentOptions[0];
  const phone = normalizePhone(values.phone) ?? values.phone;
  const wallet = normalizePhone(values.walletNumber) ?? values.walletNumber;
  const editStep = (id: StepId) => () => edit(id);

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Review your order</h2>
        <p className="text-sm text-muted-foreground">Check your details, then confirm. You can still edit anything.</p>
      </div>

      <ReviewCard title="Contact" onEdit={editStep("contact")}>
        <b>{values.fullName}</b>
        <p className="text-muted-foreground">{phone}{values.email.trim() && ` · ${values.email.trim()}`}</p>
      </ReviewCard>

      <ReviewCard title="Delivery address" onEdit={editStep("address")}>
        <b>{values.address}</b>
        {values.landmark.trim() && <p className="text-muted-foreground">{values.landmark.trim()}</p>}
        <p className="text-muted-foreground">{values.area}, {SERVICE_CITY}, {SERVICE_PROVINCE}</p>
      </ReviewCard>

      <ReviewCard title="Payment" onEdit={editStep("payment")}>
        <div className="flex items-center gap-4">
          <PaymentLogo method={method.id} />
          <div className="leading-tight">
            <b>{method.label}</b>
            <p className="text-sm text-muted-foreground">
              {method.requiresWallet
                ? `${wallet} · request sent after you confirm`
                : method.id === "card"
                  ? "Secure payment page after you confirm"
                  : "Pay the rider when your order arrives"}
            </p>
          </div>
        </div>
      </ReviewCard>

      <section className="flex items-center gap-4 rounded-3xl border border-success/30 bg-primary-soft p-5 sm:p-6">
        <span className="grid size-11 shrink-0 aspect-square place-items-center rounded-xl bg-surface text-link">
          <LuTruck size={22} />
        </span>
        <p className="leading-snug">
          <b>Delivery {deliveryPromise()}</b>
          <span className="block text-sm text-muted-foreground">Estimated arrival around {arriveBy(new Date())}, {SERVICE_CITY}</span>
        </p>
      </section>
    </div>
  );
};

export default ReviewPanel;
