import Card from "../../../components/ui/Card";
import Container from "../../../components/ui/Container";
import RatingStars from "../../../components/ui/RatingStars";
import SectionHeading from "../../../components/ui/SectionHeading";
import { testimonials } from "../../../data/home.data";

const TestimonialsSection = () => (
  <section>
    <Container className="py-10">
      <SectionHeading title="What customers say" />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.id} className="grid gap-3 p-6">
            <RatingStars value={t.rating} />
            <p className="leading-relaxed">{t.quote}</p>
            <b className="text-sm">
              {t.name} <span className="font-medium text-muted-foreground">· {t.area}</span>
            </b>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default TestimonialsSection
