import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-[4px] border border-[var(--border-color)] px-3 py-2",
        "text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--brand)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{ background: "var(--bg-secondary)" }}
      {...props}
    />
  );
}

export { Textarea };
