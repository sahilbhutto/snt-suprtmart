import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";

const AppBannerSection = () => (
  <section>
    <Container className="py-10">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-ink-foreground ring-1 ring-ink-border md:flex-row md:items-center md:p-12">
        <div className="grid gap-2">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">Order faster with the SNT app</h2>
          <p className="text-ink-muted">Reorder your monthly list in one tap, track riders live and get app-only deals.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="border-0 bg-white text-neutral-900 hover:bg-white/90">App Store</Button>
          <Button variant="accent">Google Play</Button>
        </div>
      </div>
    </Container>
  </section>
);

export default AppBannerSection
