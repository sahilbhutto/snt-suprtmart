import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LuLeaf, LuPackageCheck, LuShieldCheck, LuTruck } from "react-icons/lu";

const benefits = [
  { icon: LuTruck, title: "Delivery in 2 hours", text: "Fresh groceries to your door in Larkana" },
  { icon: LuPackageCheck, title: "Track every order", text: "Follow your order from packing to your door" },
  { icon: LuShieldCheck, title: "Safe and secure", text: "Your phone is verified and your data is protected" },
];

const Logo = ({ inverted }: { inverted?: boolean }) => (
  <Link to="/" className="flex w-max items-center gap-2.5">
    <span className={`grid size-10 place-items-center rounded-xl ${inverted ? "bg-white/10 text-accent" : "bg-ink text-accent"}`}>
      <LuLeaf size={22} />
    </span>
    <b className="text-xl tracking-tight">
      SNT <span className={inverted ? "text-accent" : "text-link"}>Supermart</span>
    </b>
  </Link>
);

const AuthShell = ({ children }: { children: ReactNode }) => (
  <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
    {/* Brand panel, desktop only */}
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-ink-foreground lg:flex">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-accent/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-primary/25 blur-3xl" />

      <div className="relative"><Logo inverted /></div>

      <div className="relative grid gap-8">
        <h2 className="max-w-md text-5xl font-bold leading-[1.05] tracking-tight">Your town&apos;s supermarket, in one tap.</h2>
        <ul className="grid gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <li key={b.title} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 aspect-square place-items-center rounded-xl bg-white/10 text-accent">
                  <Icon size={22} />
                </span>
                <span className="leading-snug">
                  <b className="block">{b.title}</b>
                  <span className="text-sm text-ink-muted">{b.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative text-xs text-ink-muted">© {new Date().getFullYear()} SNT Supermart. Larkana, Sindh.</p>
    </aside>

    {/* Form side */}
    <main id="main-content" className="flex flex-col px-4 py-6 sm:px-10 sm:py-10">
      <div className="lg:hidden"><Logo /></div>
      <div className="mx-auto grid w-full max-w-md flex-1 content-center gap-8 py-8">{children}</div>
    </main>
  </div>
);

export default AuthShell;
