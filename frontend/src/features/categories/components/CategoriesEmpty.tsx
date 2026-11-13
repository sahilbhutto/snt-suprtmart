import { LuSearchX } from "react-icons/lu";
import Button from "../../../components/ui/Button";

/* MOVE TO: src/features/categories/CategoriesEmpty.tsx */
const CategoriesEmpty = ({ onClear }: { onClear: () => void }) => (
  <div className="grid place-items-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
    <span className="grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
      <LuSearchX size={30} />
    </span>
    <div className="grid gap-1.5">
      <h2 className="text-xl font-bold">No categories match</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Try a different word, or remove a filter to see more categories.
      </p>
    </div>
    <Button onClick={onClear}>Clear all filters</Button>
  </div>
);

export default CategoriesEmpty
