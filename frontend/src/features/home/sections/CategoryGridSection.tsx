
import { Link } from "react-router-dom";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { categories } from "../../../data/home.data";
import Card from "../../../components/ui/Card";
import { formatCount } from "../../../lib/format";

const CategoryGridSection = () => (
  <section className="py-6 sm:py-10">
    <Container>
      <SectionHeading
        title="Shop by category"
        actionLabel="See all 86 categories"
        actionTo="/categories"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="group min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`Shop ${category.name}, ${formatCount(category.count)} items`}
          >
            <Card
              hover
              className="h-full overflow-hidden rounded-2xl border border-border/60 p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
            >
              {/* Category Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Subtle image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent" />
              </div>

              {/* Category Information */}
              <div className="space-y-1.5 p-3 sm:p-4">
                <h3 className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base">
                  {category.name}
                </h3>

                <p className="text-xs font-medium text-muted-foreground">
                  {formatCount(category.count)} items
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  </section>
);

export default CategoryGridSection;
