import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { aisleGroups } from "../../../data/home.data";
import { formatCount } from "../../../lib/format";

const AislesSection = () => (
  <section>
    <Container className="py-10">
      <SectionHeading title="Browse every aisle" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aisleGroups.map((group) => (
          <Card key={group.title} className="p-6">
            <b className="text-base">{group.title}</b>
            <ul className="mt-3 grid gap-2.5 text-sm">
              {group.links.map((l) => (
                <li key={l.slug}>
                  <Link to={`/category/${l.slug}`} className="flex items-center justify-between text-muted-foreground transition hover:text-link">
                    <span>{l.label}</span>
                    <span className="text-xs tabular-nums">{formatCount(l.count)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default AislesSection
