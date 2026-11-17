import { Link, Outlet } from "react-router-dom";
import { LuLeaf, LuLock } from "react-icons/lu";
import Container from "../../ui/Container";
import { paymentMethods } from "../../../data/layout.data";

const CheckoutLayout = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <header className="border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-ink text-accent"><LuLeaf size={22} /></span>
          <b className="text-lg tracking-tight">SNT <span className="text-link">Supermart</span></b>
        </Link>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLock size={16} className="text-link" /> Secure checkout
        </p>
      </Container>
    </header>

    <main id="main-content" className="flex-1">
      <Outlet />
    </main>

    <footer className="border-t border-border bg-surface py-6">
      <Container className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <nav className="flex flex-wrap gap-4">
          <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/legal/refunds" className="hover:text-foreground">Refunds</Link>
          <Link to="/help" className="hover:text-foreground">Help</Link>
        </nav>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((m) => (
            <span key={m} className="rounded-md border border-border px-2.5 py-1 font-bold">{m}</span>
          ))}
        </div>
      </Container>
    </footer>
  </div>
);

export default CheckoutLayout;
