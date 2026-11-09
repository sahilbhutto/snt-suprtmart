import { Link } from "react-router-dom";
import Container from "../../../components/ui/Container";
import Badge from "../../../components/ui/Badge";

const PromoBentoSection = () => (
  <section>
    <Container className="py-6">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <Link to="/deals?pay=online" className="grid min-h-56 content-end gap-2.5 rounded-3xl bg-primary p-8 text-primary-foreground transition hover:brightness-110">
          <Badge tone="neutral" className="w-max bg-surface text-foreground">Pay online</Badge>
          <h3 className="text-2xl font-bold leading-tight md:text-3xl">Rs. 150 off with JazzCash or Easypaisa</h3>
          <span className="text-sm opacity-80">Code PAYJC at checkout</span>
        </Link>
        <Link to="/category/beverages" className="grid content-end gap-1 rounded-3xl bg-tint-2 p-6 text-foreground transition hover:shadow-pop">
          <b className="text-xl">Buy 2 get 1</b>
          <span className="text-sm text-muted-foreground">Selected beverages</span>
        </Link>
        <Link to="/category/baby" className="grid content-end gap-1 rounded-3xl bg-tint-3 p-6 text-foreground transition hover:shadow-pop">
          <b className="text-xl">Baby essentials</b>
          <span className="text-sm text-muted-foreground">Up to 25% off</span>
        </Link>
      </div>
    </Container>
  </section>
);

export default PromoBentoSection
