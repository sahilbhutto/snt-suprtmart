import { Link, useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { useState, type FormEvent } from "react";
import Container from "../ui/Container";
import { LuHeart, LuLeaf, LuMapPin, LuMenu, LuMoon, LuSearch, LuShoppingCart, LuSun, LuTruck, LuUser } from "react-icons/lu";
import { categories, navItems } from "../../data/home.data";
import Button from "../ui/Button";
import { formatPrice } from "../../lib/format";
import { cn } from "../../lib/cn";

const Header = ({ cartCount, cartTotal }: { cartCount: number; cartTotal: number }) => {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center gap-3 md:h-20 md:gap-4">
          <button type="button" aria-label="Open menu" className="grid size-10 place-items-center rounded-full border border-border lg:hidden">
            <LuMenu />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-accent">
              <LuLeaf size={22} />
            </span>
            <b className="hidden text-xl tracking-tight sm:block">
              SNT <span className="text-link">Supermart</span>
            </b>
          </Link>

          <button type="button" className="hidden min-w-44 items-center gap-2 rounded-full border border-border px-4 py-1.5 text-left lg:flex">
            <LuMapPin />
            <span className="leading-tight">
              <span className="block text-[11px] text-muted-foreground">Deliver to</span>
              <span className="text-sm font-semibold">Select area</span>
            </span>
          </button>

          <form onSubmit={handleSearch} role="search" className="hidden flex-1 items-center rounded-full border border-border bg-background p-1 md:flex">
            <select aria-label="Category" className="w-36 bg-transparent px-3 text-sm outline-none">
              <option>All categories</option>
              {categories.map((c) => (
                <option key={c.slug}>{c.name}</option>
              ))}
            </select>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
              placeholder="Search 70,000+ products"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-subtle-foreground"
            />
            <Button size="icon" type="submit" aria-label="Search" className="size-10">
              <LuSearch />
            </Button>
          </form>

          <span className="flex-1 md:hidden" />

          <Button variant="secondary" size="icon" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {dark ? <LuSun /> : <LuMoon />}
          </Button>
          <Button variant="secondary" size="icon" to="/account/wishlist" aria-label="Wishlist" className="hidden sm:inline-flex">
            <LuHeart />
          </Button>
          <Button variant="secondary" size="icon" to="/account" aria-label="Account" className="hidden sm:inline-flex">
            <LuUser />
          </Button>
          <Button variant="ink" to="/cart" className="gap-2.5">
            <LuShoppingCart size={18} />
            <span className="hidden sm:inline tabular-nums">{formatPrice(cartTotal)}</span>
            <span className="grid min-w-6 place-items-center rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{cartCount}</span>
          </Button>
        </div>

        <nav aria-label="Categories" className="hidden h-12 items-center gap-7 text-sm font-semibold lg:flex">
          <Link to="/categories" className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-ink-foreground">
            <LuMenu size={16} className="text-accent" />
            All categories
          </Link>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={cn('transition hover:text-link', item.highlight && 'text-deal')}>
              {item.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <LuTruck size={16} /> 2-hour delivery
          </span>
        </nav>
      </Container>
    </header>
  );
};


export default Header
