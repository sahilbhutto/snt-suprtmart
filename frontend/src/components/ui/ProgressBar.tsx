
const ProgressBar = ({ value, label }: { value: number; label?: string }) => (
  <div className="grid gap-1">
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-deal" style={{ width: `${value}%` }} />
    </div>
    {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
  </div>
);


export default ProgressBar
