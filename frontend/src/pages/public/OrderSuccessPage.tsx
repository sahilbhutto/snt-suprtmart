import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuCheck, LuCopy, LuMapPin, LuPackageCheck, LuPhone, LuTruck, LuWallet } from "react-icons/lu";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import { cn } from "../../lib/cn";
import { formatPrice } from "../../lib/format";
import { getLastOrder } from "../../features/checkout/api/checkout.api";
import PaymentLogo from "../../features/checkout/components/PaymentLogo";
import { paymentOptions } from "../../features/checkout/data/checkout.data";
import { arriveBy, deliveryPromise } from "../../features/checkout/lib/eta";

const timeline = [
  { label: "Order placed", icon: LuCheck },
  { label: "Packing", icon: LuPackageCheck },
  { label: "On the way", icon: LuTruck },
  { label: "Delivered", icon: LuMapPin },
];

const OrderSuccessPage = () => {
  const { orderNumber = "" } = useParams<{ orderNumber: string }>();
  const order = getLastOrder(orderNumber);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Order placed | SNT Supermart";
  }, []);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const method = paymentOptions.find((p) => p.id === order?.paymentMethod);

  return (
    <div className="pb-16">
      <Container className="grid gap-6 pt-6 sm:gap-8 sm:pt-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-center text-ink-foreground ring-1 ring-ink-border sm:rounded-[2.25rem] sm:p-14">
          <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 size-96 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative grid justify-items-center gap-5">
            <span className="grid size-24 animate-pop place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_0_0_14px_rgb(198_244_50/0.16),0_0_0_30px_rgb(198_244_50/0.08)]">
              <LuCheck size={48} strokeWidth={3} />
            </span>

            <div className="mt-4 grid gap-2">
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">Order placed!</h1>
              <p className="mx-auto max-w-md text-ink-muted sm:text-lg">
                {order ? `Thank you, ${order.customerName.split(" ")[0]}. We are getting your order ready now.` : "Thank you. We are getting your order ready now."}
              </p>
            </div>

            <button
              type="button"
              onClick={copyNumber}
              aria-label={`Copy order number ${orderNumber}`}
              className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-extrabold backdrop-blur transition hover:bg-white/20"
            >
              Order {orderNumber}
              {copied ? <LuCheck size={16} className="text-accent" /> : <LuCopy size={16} />}
              <span className="sr-only" aria-live="polite">{copied ? "Copied" : ""}</span>
            </button>

            {order && (
              <p className="text-ink-muted">
                Arriving {deliveryPromise(order.etaMinutes)}, around <b className="text-accent">{arriveBy(order.createdAt, order.etaMinutes)}</b>
              </p>
            )}
          </div>
        </section>

        {/* Timeline */}
        <section aria-label="Order status" className="rounded-3xl border border-border bg-surface px-5 py-7 shadow-card sm:px-10">
          <ol className="grid grid-cols-4 gap-2">
            {timeline.map((step, i) => {
              const Icon = step.icon;
              const done = i === 0;
              const current = i === 1;
              return (
                <li key={step.label} className="grid justify-items-center gap-2.5 text-center">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-full sm:size-[52px]",
                      done && "bg-success text-background",
                      current && "animate-pulse-dot bg-primary-soft text-link ring-4 ring-primary/25",
                      !done && !current && "bg-surface-muted text-subtle-foreground",
                    )}
                  >
                    <Icon size={22} />
                  </span>
                  <span className={cn("text-xs font-bold sm:text-sm", !done && !current && "text-subtle-foreground")}>{step.label}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {order ? (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_25rem]">
            <div className="grid gap-4">
              <section className="grid gap-4 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-7">
                <h2 className="flex items-center gap-2.5 text-lg font-bold"><LuMapPin size={22} className="text-link" /> Delivering to</h2>
                <div className="grid gap-1 leading-relaxed">
                  <b>{order.customerName}</b>
                  <span className="text-muted-foreground">{order.street}</span>
                  <span className="text-muted-foreground">{order.area}, {order.city}</span>
                  <span className="mt-1 flex items-center gap-2 text-muted-foreground"><LuPhone size={14} /> {order.phone}</span>
                </div>
              </section>

              <section className="grid gap-4 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-7">
                <h2 className="flex items-center gap-2.5 text-lg font-bold"><LuWallet size={22} className="text-link" /> Payment</h2>
                <div className="flex items-center gap-4">
                  {method && <PaymentLogo method={method.id} />}
                  <div className="leading-snug">
                    <b>{method?.label} · {formatPrice(order.total)}</b>
                    <p className="text-sm text-muted-foreground">
                      {order.paymentStatus === "cod"
                        ? `Please keep ${formatPrice(order.total)} ready. Pay the rider in cash when your order arrives.`
                        : order.paymentMethod === "card"
                          ? "Complete the payment on the secure page to confirm your order."
                          : `Approve the request we sent to your ${method?.label} app to confirm your order.`}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside aria-label="Order details" className="grid gap-5 rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold">Order details</h2>
              <ul className="grid gap-3">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <b className="block truncate">{item.name}</b>
                      <span className="text-xs text-muted-foreground">{item.unit} × {item.quantity}</span>
                    </span>
                    <b className="tabular-nums">{formatPrice(item.lineTotal)}</b>
                  </li>
                ))}
              </ul>

              <dl className="grid gap-2.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold tabular-nums">{formatPrice(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="font-semibold tabular-nums">{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</dd></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success"><dt>Coupon</dt><dd className="font-semibold tabular-nums">- {formatPrice(order.discount)}</dd></div>
                )}
                <div className="flex items-baseline justify-between border-t border-border pt-3.5">
                  <dt className="font-bold">Total</dt>
                  <dd className="text-2xl font-extrabold tabular-nums">{formatPrice(order.total)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border-strong p-6 text-center text-sm text-muted-foreground">
            The details of this order are available in your account under My orders.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Button to={`/track?order=${orderNumber}`} size="lg" className="min-h-14 px-9">Track order</Button>
          <Button to="/products" variant="secondary" size="lg" className="min-h-14 px-9">Continue shopping</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Need help? <Link to="/help" className="font-bold text-link hover:underline">Contact support</Link>
        </p>
      </Container>
    </div>
  );
};

export default OrderSuccessPage;
