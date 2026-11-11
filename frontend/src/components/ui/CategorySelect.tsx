import { useRef, useState } from "react";
import { formatCount, tintBg } from "../../lib/format";
import { categories } from "../../data/home.data";
import { LuCheck, LuChevronDown, LuMenu } from "react-icons/lu";
import { cn } from "../../lib/cn";
import useClickOutside from "../../hooks/useClickOutside";

const CategorySelect = ({ value, onChange }: { value: string; onChange: (slug: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const current = categories.find((c) => c.slug === value);
  const pick = (slug: string) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold ring-1 ring-border transition hover:ring-border-strong"
      >
        <span className="max-w-28 truncate">{current?.name ?? 'All categories'}</span>
        <LuChevronDown size={16} className={cn('text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul role="listbox" aria-label="Category" className="absolute left-0 top-full z-50 mt-3 max-h-80 w-72 overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-pop">
          <li>
            <button type="button" role="option" aria-selected={!value} onClick={() => pick('')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-surface-muted">
              <span className="grid size-8 place-items-center rounded-lg bg-ink text-accent"><LuMenu size={16} /></span>
              <span className="flex-1">All categories</span>
              {!value && <LuCheck size={16} className="text-link" />}
            </button>
          </li>
          {categories.map((c) => {
            const Icon = c.icon;
            const selected = value === c.slug;
            return (
              <li key={c.slug}>
                <button type="button" role="option" aria-selected={selected} onClick={() => pick(c.slug)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-surface-muted', selected && 'bg-surface-muted font-bold')}>
                  <span className={cn('grid size-8 place-items-center rounded-lg text-foreground/80', tintBg[c.tint])}><Icon size={16} /></span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{formatCount(c.count)}</span>
                  {selected && <LuCheck size={16} className="text-link" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CategorySelect
