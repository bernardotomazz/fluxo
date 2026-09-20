import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-1 rounded-[4px] text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: { default: "bg-transparent", outline: "border border-input bg-transparent" },
      size: { default: "min-w-11 px-3", sm: "min-h-11 min-w-11 px-2 text-xs", lg: "min-h-12 min-w-12 px-4" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
