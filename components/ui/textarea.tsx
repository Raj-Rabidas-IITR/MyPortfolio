import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[96px] w-full rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] px-3 py-2 text-sm text-[color:var(--personal-text)] outline-none transition focus:border-[color:var(--personal-accent)] focus:ring-2 focus:ring-[color:var(--personal-accent-muted)] placeholder:text-[color:var(--personal-muted)]",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
