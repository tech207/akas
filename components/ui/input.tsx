import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full border border-brand-charcoal/15 bg-white px-4 py-2 font-sans text-sm text-brand-charcoal outline-none transition-colors placeholder:text-brand-stone/60 focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
