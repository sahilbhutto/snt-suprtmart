import { Link } from "react-router-dom";
import { LuArrowRight, LuShoppingBag } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import { getFeaturedCategories } from "../../../data/catalog.selectors";

const CartEmpty = () => (
  <section aria-labelledby="empty-cart-title" className="grid place-items-center gap-6 rounded-[2rem] border border-border bg-surface px-6 py-16 text-center shadow-card sm:py-20">
    <span className="grid size-24 place-items-center rounded-3xl bg-tint-1 text-foreground/70">
      <LuShoppingBag size={44} />
    </span>

    <div className="grid max-w-md gap-2">
      <h1 id="empty-cart-title" className="text-3xl font-bold tracking-tight">Your cart is empty</h1>
      <p className="text-muted-foreground">Add groceries and we will deliver them in about 2 hours. Pay cash on delivery or online.</p>
    </div>

    <div className="flex flex-wrap justify-center gap-3">
      <Button to="/products" size="lg">
        Start shopping <LuArrowRight size={16} className="rtl:rotate-180" />
      </Button>
      <Button to="/categories" size="lg" variant="secondary">Browse categories</Button>
    </div>

    <div className="flex flex-wrap justify-center gap-2">
      {getFeaturedCategories(6).map((c) => (
        <Link key={c.slug} to={`/category/${c.slug}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:border-border-strong">
          {c.name}
        </Link>
      ))}
    </div>
  </section>
);

export default CartEmpty;
