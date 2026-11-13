import { LuArrowRight, LuSearchX } from "react-icons/lu"
import Button from "../../../components/ui/Button"

const CategoryNotFound = () => (
  <main className="grid place-items-center px-4 py-24 text-center">
    <div className="grid max-w-md gap-4">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
        <LuSearchX size={30} />
      </span>
      <h1 className="text-3xl font-bold">Category not found</h1>
      <p className="text-muted-foreground">This category may have moved. Browse all categories to find what you need.</p>
      <Button to="/categories" className="mx-auto">
        Browse all categories <LuArrowRight size={16} className="rtl:rotate-180" />
      </Button>
    </div>
  </main>
)

export default CategoryNotFound
