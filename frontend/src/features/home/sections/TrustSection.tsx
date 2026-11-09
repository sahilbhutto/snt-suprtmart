import Card from "../../../components/ui/Card";
import Container from "../../../components/ui/Container";
import { trustItems } from "../../../data/home.data";

const TrustSection = () => (
  <section>
    <Container className="py-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.title} className="p-6">
              <span className="mb-3 block text-link">
                <Icon size={28} />
              </span>
              <b>{t.title}</b>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            </Card>
          );
        })}
      </div>
    </Container>
  </section>
);

export default TrustSection
