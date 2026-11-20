import { useRef } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";
import { cn } from "../../../lib/cn";

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

const OtpInput = ({ length, value, onChange, onComplete, disabled, hasError, autoFocus }: OtpInputProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) => refs.current[Math.min(Math.max(i, 0), length - 1)]?.focus();

  const update = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const entered = e.target.value.replace(/\D/g, "");

    if (!entered) {
      update(value.slice(0, i) + value.slice(i + 1));
      return;
    }
    // Autofill or paste can put the whole code in one box
    if (entered.length > 2) {
      update(entered);
      focusAt(entered.length);
      return;
    }
    const digit = entered.slice(-1);
    update(value.slice(0, i) + digit + value.slice(i + 1));
    focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      e.preventDefault();
      update(value.slice(0, i - 1));
      focusAt(i - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    update(text);
    focusAt(text.length);
  };

  return (
    <div role="group" aria-label="One-time code" className="flex justify-between gap-2 sm:gap-3">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => {
            e.target.select();
            if (i > value.length) focusAt(value.length); // always type from the first empty box
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={i === 0 ? length : 1}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={hasError || undefined}
          className={cn(
            "h-14 w-full min-w-0 rounded-xl border-2 bg-background text-center text-2xl font-bold tabular-nums outline-none transition focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-60",
            hasError ? "border-danger" : value[i] ? "border-primary/60" : "border-border",
          )}
        />
      ))}
    </div>
  );
};

export default OtpInput;
