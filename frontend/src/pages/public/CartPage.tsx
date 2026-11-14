import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft, LuInfo, LuTrash2 } from "react-icons/lu";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import { formatPrice } from "../../lib/format";
import { useCartView } from "../../features/cart/hooks/useCartView";
import { useCartStore } from "../../features/cart/store/cartStore";
import CartEmpty from "../../features/cart/components/CartEmpty";
import SavedForLater from "../../features/cart/components/SavedForLater";
import ProductShelf from "../../features/products/components/ProductShelf";
import FreeDeliveryProgress from "../../features/cart/components/FreeDeliveryProgress";
import CartPageItem from "../../features/cart/components/CartPageItem";
import CartOrderSummary from "../../features/cart/components/CartOrderSummary";
import CartCheckoutBar from "../../features/cart/components/CartCheckoutBar";

const CartPage = () => {
  const view = useCartView();
  const clear = useCartStore((s) => s.clear);
  const removeLine = useCartStore((s) => s.removeLine);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    document.title = "Your cart | SNT Supermart";
  }, []);

  const { lines, summary, count, canCheckout, unavailableCount, overStockCount, priceChangedCount, suggestions } = view;
  const issueCount = unavailableCount + overStockCount;

  const fixCart = () => {
    for (const l of lines) {
      if (l.unavailable) removeLine(l.id);
      else if (l.overStock) setQuantity(l.id, l.maxQuantity);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="pb-12">
        <Container className="grid gap-8 pt-4 sm:gap-10 sm:pt-6">
          <CartEmpty />
          <SavedForLater />
          <ProductShelf title="Popular right now" products={suggestions} actionLabel="See all" actionTo="/products" />
        </Container>
      </div>
    );
  }

  return (
    <div className="pb-28 lg:pb-12">
      <Container className="grid gap-6 pt-4 sm:gap-8 sm:pt-6">
        {/* Heading */}
        <div className="grid gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition hover:text-foreground">Home</Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-foreground">Cart</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your cart</h1>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {count} {count === 1 ? "item" : "items"} · {formatPrice(summary.total)} total
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button to="/products" variant="secondary" size="sm">
                <LuArrowLeft size={14} className="rtl:rotate-180" /> Continue shopping
              </Button>
              {confirmClear ? (
                <>
                  <Button size="sm" variant="ink" onClick={() => { clear(); setConfirmClear(false); }}>
                    Yes, clear cart
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>Cancel</Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setConfirmClear(true)}>
                  <LuTrash2 size={14} /> Clear cart
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {issueCount > 0 && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-sm font-semibold text-danger">
              <LuInfo size={18} className="mt-px shrink-0" />
              {unavailableCount > 0 && `${unavailableCount} ${unavailableCount === 1 ? "item is" : "items are"} unavailable. `}
              {overStockCount > 0 && `${overStockCount} ${overStockCount === 1 ? "item has" : "items have"} fewer units than you asked for. `}
              Fix your cart to continue.
            </p>
            <Button size="sm" variant="ink" onClick={fixCart}>Fix my cart</Button>
          </div>
        )}
        {issueCount === 0 && priceChangedCount > 0 && (
          <p className="flex items-center gap-2.5 rounded-2xl bg-info-soft px-4 py-3 text-sm font-semibold text-info">
            <LuInfo size={18} className="shrink-0" />
            Prices changed for {priceChangedCount} {priceChangedCount === 1 ? "item" : "items"} in your cart. Totals are up to date.
          </p>
        )}

        {/* Items and summary */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] xl:gap-8">
          <div className="grid gap-4">
            <FreeDeliveryProgress summary={summary} />
            <ul className="grid gap-4" aria-label="Cart items">
              {lines.map((line) => (
                <CartPageItem key={line.id} line={line} />
              ))}
            </ul>
          </div>

          <CartOrderSummary
            summary={summary}
            itemCount={count}
            canCheckout={canCheckout}
            blockedMessage={issueCount > 0 ? "Remove or update the items marked above." : undefined}
          />
        </div>

        <SavedForLater />
        <ProductShelf title="Complete your basket" products={suggestions} actionLabel="See all" actionTo="/products" />
      </Container>

      <CartCheckoutBar summary={summary} canCheckout={canCheckout} />
    </div>
  );
};

export default CartPage;
