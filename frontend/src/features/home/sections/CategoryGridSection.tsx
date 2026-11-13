import { Link } from "react-router-dom";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import Card from "../../../components/ui/Card";
import { categoryItems } from "../../../data/catalog.selectors";
import { formatCount } from "../../../lib/format";

const CategoryGridSection = () => (
  <section className="py-6 sm:py-10">
    <Container>
      <SectionHeading
        title="Shop by category"
        actionLabel="See all categories"
        actionTo="/categories"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {categoryItems.slice(0, 12).map((category) => {
          const imageUrl =
            typeof category.image === "string"
              ? category.image
              : category?.image;

          return (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Shop ${category.name}, ${formatCount(category.productCount)} items`}
            >
              <Card
                hover
                className="h-full overflow-hidden rounded-2xl border border-border/60 p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground text-sm">
                      {category.name}
                    </div>
                  )}
                </div>
                <div className="p-3 leading-tight">
                  <b className="block truncate text-sm">{category.name}</b>
                  <span className="text-xs text-muted-foreground">
                    {formatCount(category.productCount)} items
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  </section>
);

export default CategoryGridSection;
