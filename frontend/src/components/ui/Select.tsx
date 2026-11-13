import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { cn } from "../../lib/cn";
import useClickOutside from "../../hooks/useClickOutside";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
  meta?: string; // small text on the right, e.g. a count
}

interface SelectProps<T extends string> {
  caption: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  leadingIcon?: ReactNode;
  align?: "start" | "end";
  className?: string;
}

const Select = <T extends string>({
  caption,
  value,
  options,
  onChange,
  leadingIcon,
  align = "start",
  className,
}: SelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  useClickOutside(ref, () => setOpen(false), open);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (open) setActive(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={`${caption}: ${selected.label}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-14 w-full items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 text-start shadow-card transition hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "border-primary ring-2 ring-ring",
        )}
      >
        {leadingIcon && (
          <span className="grid size-9 shrink-0 aspect-square place-items-center rounded-xl bg-surface-muted text-link">
            {leadingIcon}
          </span>
        )}
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{caption}</span>
          <span className="block truncate text-sm font-bold">{selected.label}</span>
        </span>
        <LuChevronDown className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={caption}
          className={cn(
            "absolute top-full z-40 mt-2 max-h-80 min-w-full animate-pop overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-pop sm:min-w-72",
            align === "end" ? "end-0" : "start-0",
          )}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                i === active && "bg-surface-muted",
                o.value === value && "font-bold",
              )}
            >
              {o.icon && (
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-foreground/80">
                  {o.icon}
                </span>
              )}
              <span className="flex-1 truncate">{o.label}</span>
              {o.meta && <span className="text-xs tabular-nums text-muted-foreground">{o.meta}</span>}
              {o.value === value && <LuCheck size={16} className="shrink-0 text-link" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
