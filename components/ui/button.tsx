import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--personal-accent)] text-[color:var(--personal-accent-foreground)] hover:brightness-110 focus-visible:ring-[color:var(--personal-accent)]",
  secondary:
    "border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] text-[color:var(--personal-text)] hover:border-[color:var(--personal-accent)] hover:bg-[color:var(--personal-accent-muted)] hover:text-[color:var(--personal-accent-text)] focus-visible:ring-[color:var(--personal-accent)]",
  ghost:
    "text-[color:var(--personal-muted)] hover:bg-[color:var(--personal-card-muted)] hover:text-[color:var(--personal-text)] focus-visible:ring-[color:var(--personal-accent)]",
  outline:
    "border border-[color:var(--personal-border)] text-[color:var(--personal-accent-text)] hover:border-[color:var(--personal-accent)] hover:bg-[color:var(--personal-accent-muted)] focus-visible:ring-[color:var(--personal-accent)]",
  danger:
    "border border-rose-300/30 bg-rose-500/90 text-white hover:bg-rose-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
