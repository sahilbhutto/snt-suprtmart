import { LuArrowRight } from "react-icons/lu";
import Button from "../../../components/ui/Button";

const RequestBand = () => (
  <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-border bg-primary-soft p-6 sm:flex-row sm:items-center sm:p-8">
    <div className="grid gap-1">
      <b className="text-lg sm:text-xl">Cannot find a category?</b>
      <p className="text-sm text-muted-foreground">Search all 70,000+ products, or tell us what you need.</p>
    </div>
    <div className="flex flex-wrap gap-3">
      <Button to="/products">
        Search all products <LuArrowRight size={16} className="rtl:rotate-180" />
      </Button>
      <Button to="/help" variant="secondary">Request a product</Button>
    </div>
  </div>
);


export default RequestBand
