import type { InputHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  hasError?: boolean;
}

/** Mobile number with a fixed +92 in front. Spread the result of form.bind(...) into it */
const PhoneInput = ({ hasError, ...rest }: PhoneInputProps) => (
  <div
    className={cn(
      "flex h-12 items-center gap-3 rounded-xl border bg-surface px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-ring",
      hasError ? "border-danger" : "border-border",
    )}
  >
    <span className="border-e border-border pe-3 text-sm font-bold text-muted-foreground">+92</span>
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      placeholder="300 1234567"
      {...rest}
      className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle-foreground"
    />
  </div>
);

export default PhoneInput;
