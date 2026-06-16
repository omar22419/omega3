import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer size-4 shrink-0 rounded-[3px] border border-[var(--border-color)] transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-[var(--brand)]",
        className
      )}
      style={{ background: "var(--bg-secondary)" }}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <div
          className="flex items-center justify-center size-full rounded-[2px]"
          style={{ background: "var(--brand)" }}
        >
          <CheckIcon size={10} strokeWidth={3} />
        </div>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
