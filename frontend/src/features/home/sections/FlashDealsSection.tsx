import { Link } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import Container from "../../../components/ui/Container";
import useCountdown from "../../../hooks/useCountdown";
import ProductCard from "../../../components/product/ProductCard";
import { flashDeals } from "../../../data/home.data";
import type { CartState } from "../../../types/catalog";

const FlashDealsSection = ({ cart, onAdd, onRemove }: { cart: CartState; onAdd: (id: string) => void; onRemove: (id: string) => void }) => {
  const { hours, minutes, seconds } = useCountdown(5 * 3600 + 42 * 60 + 10);

  return (
    <section>
      <Container className="py-10">
        <div className="rounded-3xl bg-ink p-6 text-ink-foreground ring-1 ring-ink-border md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Flash deals</h2>
              <Badge tone="accent" className="tabular-nums">
                Ends in {hours}:{minutes}:{seconds}
              </Badge>
            </div>
            <Link to="/deals" className="text-sm font-bold text-accent hover:underline">
              View all deals
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {flashDeals.map((p) => (
              <ProductCard key={p.id} product={p} quantity={cart[p.id] ?? 0} onAdd={onAdd} onRemove={onRemove} showProgress />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};


export default FlashDealsSection
