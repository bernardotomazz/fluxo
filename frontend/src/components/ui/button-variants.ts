import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] border border-transparent bg-clip-padding text-sm font-medium transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-85",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-85",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-85",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "gap-2 px-4",
        xs: "min-h-11 gap-1 px-2 text-xs",
        sm: "min-h-11 gap-1.5 px-3 text-xs",
        lg: "min-h-12 gap-2 px-5",
        icon: "h-11 w-11",
        "icon-xs": "h-11 w-11",
        "icon-sm": "h-11 w-11",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
