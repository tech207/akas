import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full border border-brand-charcoal/15 bg-white px-4 py-3 font-sans text-sm text-brand-charcoal outline-none transition-colors placeholder:text-brand-stone/60 focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
