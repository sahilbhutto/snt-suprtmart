import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { footerColumns, paymentMethods } from "../../data/home.data";

const Footer = () => (

  <footer className="mt-12 bg-ink text-ink-foreground">
    <Container className="py-14">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr_1.6fr]">
        <div className="grid content-start gap-3">
          <b className="text-xl">SNT Supermart</b>
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            Groceries and daily essentials for the whole town. Wakeel Colony, Larkana
 · 03128919735
          </p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title} className="grid content-start gap-2.5 text-sm">
            <b>{col.title}</b>
            {col.links.map((l) => (
              <Link key={l.label} to={l.to} className="text-ink-muted transition hover:text-ink-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <form onSubmit={(e) => e.preventDefault()} className="grid content-start gap-3 text-sm">
          <b>Weekly offers</b>
          <div className="flex gap-2">
            <input
              type="email"
              aria-label="Email address"
              placeholder="Email address"
              className="min-h-11 min-w-0 flex-1 rounded-full border border-ink-border bg-white/5 px-4 text-sm text-ink-foreground outline-none placeholder:text-ink-muted focus:border-accent"
            />
            <Button variant="accent">Join</Button>
          </div>
        </form>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink-border pt-6 text-xs">
        <span className="text-ink-muted">© {new Date().getFullYear()} SNT Supermart. All rights reserved.</span>
        <span className="flex flex-wrap gap-2">
          {paymentMethods.map((m) => (
            <span key={m} className="rounded-lg border border-ink-border px-3 py-1.5 font-bold">
              {m}
            </span>
          ))}
        </span>
      </div>
    </Container>
  </footer>
);


export default Footer
