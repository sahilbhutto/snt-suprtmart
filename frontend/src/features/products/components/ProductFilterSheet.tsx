import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import type { ProductFiltersState } from "../hooks/useProductFilters";
import { cn } from "../../../lib/cn";
import ProductFilters from "./ProductFilters";
import Button from "../../../components/ui/Button";
import { formatCount } from "../../../lib/format";

interface ProductFilterSheetProps {
  open: boolean;
  onClose: () => void;
  f: ProductFiltersState;
  showCategory?: boolean;
}

const ProductFilterSheet = ({ open, onClose, f, showCategory = true }: ProductFilterSheetProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <div className={cn("fixed inset-0 z-[65] transition-[visibility] duration-300 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close filters"
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-background shadow-pop transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border-strong" aria-hidden />
        <header className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-bold">
            Filters {f.activeCount > 0 && <span className="text-sm font-semibold text-muted-foreground">({f.activeCount})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid size-10 shrink-0 aspect-square place-items-center rounded-full border border-border bg-surface"
          >
            <LuX size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          <ProductFilters f={f} showCategory={showCategory} />
        </div>

        <footer className="flex gap-3 border-t border-border bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <Button variant="secondary" onClick={f.clearAll} disabled={!f.hasFilters} className="flex-1">
            Clear
          </Button>
          <Button onClick={onClose} className="flex-[2]">
            Show {formatCount(f.total)} products
          </Button>
        </footer>
      </section>
    </div>,
    document.body,
  );
};

export default ProductFilterSheet;
