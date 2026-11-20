import { LuCheck } from "react-icons/lu";
import { cn } from "../../../lib/cn";

const steps = ["Your details", "Verify phone"];

const AuthStepper = ({ current }: { current: 1 | 2 }) => (
  <ol aria-label="Sign up progress" className="flex items-center gap-3">
    {steps.map((label, i) => {
      const number = i + 1;
      const done = number < current;
      const active = number === current;
      return (
        <li key={label} aria-current={active ? "step" : undefined} className={cn("flex items-center gap-3", i === 0 && "flex-1")}>
          <span
            className={cn(
              "grid size-8 shrink-0 aspect-square place-items-center rounded-full text-sm font-bold",
              done && "bg-success text-background",
              active && "bg-ink text-ink-foreground",
              !done && !active && "bg-surface-muted text-subtle-foreground",
            )}
          >
            {done ? <LuCheck size={16} /> : number}
          </span>
          <span className={cn("text-sm font-bold", !done && !active && "text-subtle-foreground")}>{label}</span>
          {i === 0 && <span aria-hidden className={cn("h-1 flex-1 rounded-full", done ? "bg-success" : "bg-border")} />}
        </li>
      );
    })}
  </ol>
);

export default AuthStepper;
