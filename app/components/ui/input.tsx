import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Figma design: h-8, px-3, rounded-[4px], bg-bg-secondary, border border-border
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-8 px-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)]",
        "text-[var(--text-primary)] text-[13px] placeholder:text-[var(--text-tertiary)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--brand)] transition-all w-full",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" size={14} aria-hidden="true" />
      <Input className={cn("pl-9", className)} {...props} />
    </div>
  );
}

export { Input, SearchInput };
