import { Link } from "react-router-dom";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import Card from "../../../components/ui/Card";
import { brands } from "../../../data/home.data";

const BrandsSection = () => (
  <section>
    <Container className="py-10">
      <SectionHeading title="Top brands" actionLabel="All brands" actionTo="/brands" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {brands.map((b) => (
          <Link key={b} to={`/products?brand=${encodeURIComponent(b)}`}>
            <Card hover className="px-2 py-5 text-center text-sm font-extrabold text-muted-foreground">
              {b}
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  </section>
);

export default BrandsSection
