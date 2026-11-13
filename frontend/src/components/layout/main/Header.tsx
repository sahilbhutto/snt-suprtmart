import { Link, useNavigate } from "react-router-dom";
import useTheme from "../../../hooks/useTheme";
import { useState, type FormEvent } from "react";
import Container from "../../ui/Container";
import {
  LuHeart,
  LuLeaf,
  LuMapPin,
  LuMenu,
  LuMoon,
  LuSearch,
  LuShoppingCart,
  LuSun,
  LuTruck,
  LuUser,
} from "react-icons/lu";
import CategorySelect from "../../../features/categories/components/CategorySelect";
import Button from "../../ui/Button";
import { formatPrice } from "../../../lib/format";
import CategoryMenu from "./CategoryMenu";
import { cn } from "../../../lib/cn";
import { useCartStore, useCartSummary } from "../../../features/cart/store/cartStore";
import MobileSidebar from "./MobileSidebar";
import { getNavItems } from "../../../data/catalog.selectors";

const navItems = getNavItems();

const Header = () => {
  const openCart = useCartStore((s) => s.open);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, subtotal } = useCartSummary();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center gap-3 md:h-20 md:gap-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="lg:hidden"
          >
            <LuMenu />
          </Button>

          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-accent">
              <LuLeaf size={22} />
            </span>
            <b className="hidden text-xl tracking-tight sm:block">
              SNT <span className="text-link">Supermart</span>
            </b>
          </Link>

          <button
            type="button"
            className="hidden min-w-44 items-center gap-2 rounded-full border border-border px-4 py-1.5 text-left lg:flex"
          >
            <LuMapPin />
            <span className="leading-tight">
              <span className="block text-[11px] text-muted-foreground">
                Deliver to
              </span>
              <span className="text-sm font-semibold">Select area</span>
            </span>
          </button>

          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden flex-1 items-center rounded-full border border-border bg-background p-1 md:flex"
          >
            <CategorySelect value={category} onChange={setCategory} />
            <span className="mx-1 h-6 w-px bg-border" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
              placeholder="Search 70,000+ products"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-subtle-foreground"
            />
            <Button
              size="icon"
              type="submit"
              aria-label="Search"
              className="size-10"
            >
              <LuSearch />
            </Button>
          </form>

          <span className="flex-1 md:hidden" />

          <Button
            variant="secondary"
            size="icon"
            onClick={toggle}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="h-12 w-12"
          >
            {dark ? <LuSun /> : <LuMoon />}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            to="/account/wishlist"
            aria-label="Wishlist"
            className="hidden lg:inline-flex"
          >
            <LuHeart />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            to="/account"
            aria-label="Account"
            className="hidden lg:inline-flex"
          >
            <LuUser />
          </Button>

          <Button
            variant="ink"
            size="icon"
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            aria-haspopup="dialog"
            className="relative sm:w-auto sm:gap-2.5 sm:px-4"
          >
            <LuShoppingCart size={18} />
            <span className="hidden text-sm tabular-nums sm:inline">
              {formatPrice(subtotal)}
            </span>
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground sm:static sm:min-w-6 sm:px-1.5 sm:text-xs">
              {count}
            </span>
          </Button>
        </div>

        <nav
          aria-label="Categories"
          className="hidden h-12 items-center gap-7 text-sm font-semibold lg:flex"
        >
          <CategoryMenu />
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "transition hover:text-link",
                item.highlight && "text-deal",
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <LuTruck size={16} /> 2-hour delivery
          </span>
        </nav>
      </Container>
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default Header;
