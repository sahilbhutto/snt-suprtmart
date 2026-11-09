import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type ButtonVariant = 'primary' | 'secondary' | 'ink' | 'accent' | 'ghost' | 'outlineLight';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  to?: string;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-glow hover:brightness-110',
  secondary: 'border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-muted',
  ink: 'bg-ink text-ink-foreground hover:brightness-125',
  accent: 'bg-accent text-accent-foreground hover:brightness-105',
  ghost: 'text-foreground hover:bg-surface-muted',
  outlineLight: 'border border-white/25 text-ink-foreground hover:bg-white/10',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-xs',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-7 text-base',
  icon: 'size-11 p-0 text-lg',
};

const Button = ({ variant = 'primary', size = 'md', to, className, children, ...rest }: ButtonProps) => {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};


export default Button
