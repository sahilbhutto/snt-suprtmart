import { LuX } from "react-icons/lu";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

const FilterChip = ({ label, onRemove }: FilterChipProps) => (
  <button
    type="button"
    onClick={onRemove}
    aria-label={`Remove filter ${label}`}
    className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-link transition hover:brightness-95"
  >
    {label}
    <LuX size={14} />
  </button>
);

export default FilterChip;
