import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        primary:     "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-[6px]",
        secondary:   "bg-[var(--bg-hover)] hover:bg-[var(--bg-selected)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[6px]",
        ghost:       "hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-[6px]",
        destructive: "bg-[var(--priority-high)] hover:bg-red-600 text-white rounded-[6px]",
        icon:        "hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[6px] shrink-0",
        outline:     "border border-[var(--border-color)] bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-[6px]",
      },
      size: {
        sm:   "h-7 px-2.5 text-[11px] [&_svg]:size-3.5",
        md:   "h-8 px-3 text-[13px] [&_svg]:size-4",
        lg:   "h-9 px-4 text-[14px] [&_svg]:size-4",
        icon: "h-8 w-8 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
