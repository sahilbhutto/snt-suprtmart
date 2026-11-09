import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../components/ui/Container";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { LuApple, LuWheat } from "react-icons/lu";
import Card from "../../../components/ui/Card";
import { heroStats } from "../../../data/home.data";

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section>
      <Container className="pt-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-6 rounded-3xl bg-ink p-7 text-ink-foreground ring-1 ring-ink-border md:p-14">
            <Badge tone="glass" className="w-max py-1.5 text-xs">
              70,000+ products · delivered in 2 hours
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Your whole town&apos;s supermarket, in one tap
            </h1>
            <p className="max-w-lg text-base text-ink-muted md:text-lg">
              Fresh produce, daily essentials and household brands. Pay cash on delivery or online.
            </p>

            <form onSubmit={handleSearch} role="search" className="flex max-w-xl items-center rounded-full bg-white p-1.5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                placeholder="Search rice, milk, oil, eggs..."
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
              />
              <Button type="submit" variant="ink">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-ink-muted">Popular:</span>
              {['Basmati rice', 'Fresh milk', 'Cooking oil', 'Eggs', 'Tea'].map((term) => (
                <Link key={term} to={`/products?q=${encodeURIComponent(term)}`} className="rounded-full border border-ink-border px-3 py-1.5 transition hover:bg-white/10">
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Link to="/category/fruits-veg" className="group flex items-center justify-between gap-4 rounded-3xl bg-tint-1 p-7 text-foreground transition hover:shadow-pop">
              <div className="grid gap-2">
                <Badge tone="deal" className="w-max">Weekend deal</Badge>
                <b className="text-2xl leading-tight">Fruit box Rs. 999</b>
                <span className="text-sm text-muted-foreground">Save up to 20%</span>
              </div>
              <LuApple className="size-24 shrink-0 text-foreground/60 transition group-hover:scale-105" aria-hidden />
            </Link>
            <Link to="/category/pantry" className="group flex items-center justify-between gap-4 rounded-3xl bg-tint-6 p-7 text-foreground transition hover:shadow-pop">
              <div className="grid gap-2">
                <Badge tone="neutral" className="w-max bg-surface">Pantry</Badge>
                <b className="text-2xl leading-tight">Monthly rice and oil</b>
                <span className="text-sm text-muted-foreground">Free delivery</span>
              </div>
              <LuWheat className="size-24 shrink-0 text-foreground/60 transition group-hover:scale-105" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {heroStats.map((s) => (
            <Card key={s.label} className="px-6 py-5">
              <b className="block text-2xl font-extrabold tracking-tight md:text-3xl">{s.value}</b>
              <p className="text-xs text-muted-foreground md:text-sm">{s.label}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};


export default HeroSection
