import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] px-3 text-sm text-[color:var(--personal-text)] outline-none transition placeholder:text-[color:var(--personal-muted)] focus:border-[color:var(--personal-accent)] focus:ring-2 focus:ring-[color:var(--personal-accent-muted)]",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
