import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LuInfo, LuMapPin, LuShieldCheck, LuUser, LuWallet } from "react-icons/lu";
import Container from "../../components/ui/Container";
import { useCartView } from "../../features/cart/hooks/useCartView";
import { useCartStore } from "../../features/cart/store/cartStore";
import { placeOrder } from "../../features/checkout/api/checkout.api";
import AddressStep from "../../features/checkout/components/AddressStep";
import CheckoutMobileSummary from "../../features/checkout/components/CheckoutMobileSummary";
import CheckoutSidebar from "../../features/checkout/components/CheckoutSidebar";
import CheckoutStep from "../../features/checkout/components/CheckoutStep";
import ContactStep from "../../features/checkout/components/ContactStep";
import PaymentStep from "../../features/checkout/components/PaymentStep";
import ReviewPanel from "../../features/checkout/components/ReviewPanel";
import { SERVICE_CITY, paymentOptions } from "../../features/checkout/data/checkout.data";
import { useCheckoutForm } from "../../features/checkout/hooks/useCheckoutForm";
import { normalizePhone } from "../../features/checkout/lib/validation";
import CheckoutStepper from "../../features/checkout/components/CheckoutStepper";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const view = useCartView();
  const form = useCheckoutForm();
  const clear = useCartStore((s) => s.clear);
  const coupon = useCartStore((s) => s.coupon);

  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const placedRef = useRef(false);

  useEffect(() => {
    document.title = "Checkout | SNT Supermart";
  }, []);

  const { lines, summary, count, canCheckout } = view;
  const { values } = form;

  // Nothing to check out. (placedRef stops this redirect right after a successful order)
  if (lines.length === 0 && !placedRef.current) return <Navigate to="/cart" replace />;

  const review = form.active === "review";
  const method = paymentOptions.find((p) => p.id === values.paymentMethod) ?? paymentOptions[0];
  const phone = normalizePhone(values.phone) ?? values.phone;
  const wallet = normalizePhone(values.walletNumber) ?? values.walletNumber;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Pressing Enter inside a step works like "Next"
    if (form.active && form.active !== "review") {
      form.continueStep(form.active);
      return;
    }
    if (!canCheckout || !agreed || !form.prepareSubmit()) return;

    setSubmitError(null);
    setSubmitting(true);

    const billable = lines.filter((l) => !l.unavailable);
    try {
      const order = await placeOrder(
        {
          items: billable.map((l) => ({ productId: l.id, quantity: Math.min(l.quantity, l.maxQuantity) })),
          coupon,
          customer: { fullName: values.fullName.trim(), phone, email: values.email.trim() || undefined },
          address: {
            city: SERVICE_CITY,
            area: values.area,
            street: values.address.trim(),
            landmark: values.landmark.trim() || undefined,
          },
          payment: { method: values.paymentMethod, walletNumber: normalizePhone(values.walletNumber) ?? undefined },
        },
        {
          items: billable.map((l) => ({
            productId: l.id,
            name: l.product.name,
            unit: l.product.unit,
            quantity: Math.min(l.quantity, l.maxQuantity),
            lineTotal: l.lineTotal,
          })),
          itemCount: count,
          subtotal: summary.subtotal,
          delivery: summary.delivery,
          discount: summary.discount,
          total: summary.total,
        },
      );

      placedRef.current = true;
      navigate(`/order-success/${order.number}`, { replace: true });
      clear();
    } catch {
      setSubmitError("We could not place your order. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-12">
      <Container className="grid gap-6 pt-4 sm:gap-8 sm:pt-6">
        {/* Heading */}
        <div className="grid gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition hover:text-foreground">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/cart" className="transition hover:text-foreground">Cart</Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-foreground">Checkout</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuShieldCheck size={16} className="text-link" /> Secure checkout
            </p>
          </div>
        </div>

        <CheckoutStepper
          steps={[
            { id: "contact", label: "Contact", icon: LuUser, status: form.status("contact") },
            { id: "address", label: "Address", icon: LuMapPin, status: form.status("address") },
            { id: "payment", label: "Payment", icon: LuWallet, status: form.status("payment") },
            { id: "review", label: "Review", icon: LuShieldCheck, status: form.status("review") },
          ]}
        />

        {!canCheckout && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-sm font-semibold text-danger">
              <LuInfo size={18} className="mt-px shrink-0" />
              Some items in your cart are unavailable or have changed. Update your cart to continue.
            </p>
            <Link to="/cart" className="text-sm font-bold text-danger underline">Go to cart</Link>
          </div>
        )}

        {!review && <CheckoutMobileSummary view={view} />}

        <form onSubmit={handleSubmit} noValidate className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_25rem] xl:gap-8">
          {/* Left column */}
          {review ? (
            <ReviewPanel form={form} />
          ) : (
            <div className="grid gap-4">
              <CheckoutStep
                id="contact"
                number={1}
                total={form.totalSteps}
                title="Contact details"
                description="We use this to confirm and deliver your order."
                icon={LuUser}
                status={form.status("contact")}
                summary={`${values.fullName} · ${phone}`}
                onEdit={() => form.edit("contact")}
                onNext={() => form.continueStep("contact")}
                nextLabel="Continue to address"
              >
                <ContactStep form={form} />
              </CheckoutStep>

              <CheckoutStep
                id="address"
                number={2}
                total={form.totalSteps}
                title="Delivery address"
                description={`Where in ${SERVICE_CITY} should we bring your order?`}
                icon={LuMapPin}
                status={form.status("address")}
                summary={`${values.address}, ${values.area}, ${SERVICE_CITY}`}
                onEdit={() => form.edit("address")}
                onBack={() => form.goBack("address")}
                onNext={() => form.continueStep("address")}
                nextLabel="Continue to payment"
              >
                <AddressStep form={form} />
              </CheckoutStep>

              <CheckoutStep
                id="payment"
                number={3}
                total={form.totalSteps}
                title="Payment method"
                description="You only pay after we confirm your order."
                icon={LuWallet}
                status={form.status("payment")}
                summary={method.requiresWallet && values.walletNumber ? `${method.label} · ${wallet}` : method.label}
                onEdit={() => form.edit("payment")}
                onBack={() => form.goBack("payment")}
                onNext={() => form.continueStep("payment")}
                nextLabel="Review your order"
              >
                <PaymentStep form={form} total={summary.total} />
              </CheckoutStep>

              <CheckoutStep
                id="review"
                number={4}
                total={form.totalSteps}
                title="Review and confirm"
                description="Check everything before you confirm."
                icon={LuShieldCheck}
                status={form.status("review")}
                onEdit={() => undefined}
                onNext={() => undefined}
                nextLabel="Confirm"
              />

              {submitError && (
                <p role="alert" className="flex items-start gap-2.5 rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-danger">
                  <LuInfo size={18} className="mt-px shrink-0" /> {submitError}
                </p>
              )}
            </div>
          )}

          {/* Right column */}
          <div className="grid gap-4">
            {review && (
              <button
                type="button"
                onClick={() => form.goBack("review")}
                className="hidden w-max text-sm font-bold text-link hover:underline lg:block"
              >
                ← Back to payment
              </button>
            )}
            <CheckoutSidebar
              view={view}
              review={review}
              agreed={agreed}
              onAgreeChange={setAgreed}
              submitting={submitting}
              canPlace={canCheckout && form.canPlace}
            />
            {review && submitError && (
              <p role="alert" className="flex items-start gap-2.5 rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-danger">
                <LuInfo size={18} className="mt-px shrink-0" /> {submitError}
              </p>
            )}
          </div>
        </form>
      </Container>
    </div>
  );
};

export default CheckoutPage;
