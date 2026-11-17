import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export const inputClass = (hasError?: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition placeholder:text-subtle-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-ring",
    hasError ? "border-danger" : "border-border",
  );

const FormField = ({ id, label, error, hint, optional, className, children }: FormFieldProps) => (
  <div className={cn("grid content-start gap-1.5", className)}>
    <label htmlFor={id} className="flex items-center justify-between text-sm font-semibold">
      <span>{label}</span>
      {optional && <span className="text-xs font-medium text-muted-foreground">Optional</span>}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-danger">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

export default FormField;
