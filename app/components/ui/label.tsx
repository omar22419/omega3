import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-[11px] uppercase tracking-wide font-medium text-[var(--text-secondary)] select-none",
        "peer-disabled:opacity-50 cursor-default",
        className
      )}
      {...props}
    />
  );
}

export { Label };
